import { extract, type MoonwaveClass, type MoonwaveFunction, type MoonwaveProperty } from "./moonwave.ts";
import { mkdirSync, rmSync, writeFileSync, existsSync, cpSync, readdirSync } from "node:fs";
import { dirname } from "node:path";

const CLASSES_DIR = "src/content/docs/classes";
const GENERATED_DIR = "src/generated";
const CLASS_REGISTRY_PATH = "src/generated/class-registry.json";
const SYNCED_DIRS_PATH = "src/generated/synced-dirs.json";
const LUA_DECLARATION_COMPONENT = "$/components/LuaDeclaration.astro";
const LUA_PROPERTY_COMPONENT = "$/components/LuaProperty.astro";
const INHERIT_TAG = "inherit";
const INDEX_SIDEBAR_ORDER = 0;
const FILE_ENCODING = "utf-8";

const DISCORD_LUAU_DOCS_DIR = "discord-luau/docs";
const CONTENT_DOCS_DIR = "src/content/docs";

let namespaces: Set<string>;

// #region Paths

function classNameToPath(name: string, all: MoonwaveClass[]): string {
	if (!namespaces) {
		namespaces = new Set(
			all.flatMap(moonwaveClass => {
				const parts = moonwaveClass.name.split(".");
				return parts.length > 1 ? [parts[0].toLowerCase()] : [];
			}),
		);
	}

	const parts = name.split(".");
	const packageDir = parts[0].toLowerCase();
	const namespaceDirs = parts.slice(1, -1); // preserve original casing for sidebar labels
	const filename = parts[parts.length - 1].toLowerCase();

	if (parts.length === 1 && namespaces.has(packageDir)) {
		return `${CLASSES_DIR}/${packageDir}/index.mdx`;
	}

	return `${CLASSES_DIR}/${[packageDir, ...namespaceDirs, filename].join("/")}.mdx`;
}

// #endregion

// #region Inheritance

function resolveInheritance(all: MoonwaveClass[]) {
	const byName = new Map(all.map(moonwaveClass => [moonwaveClass.name, moonwaveClass]));

	function resolve(moonwaveClass: MoonwaveClass, visited = new Set<string>()): void {
		if (visited.has(moonwaveClass.name)) {
			console.warn(`  warn: circular inheritance detected involving '${moonwaveClass.name}' - skipping`);

			return;
		}

		visited.add(moonwaveClass.name);

		const parentNames = (moonwaveClass.tags ?? [])
			.filter(tag => tag.startsWith(`${INHERIT_TAG}:`))
			.map(tag => tag.slice(`${INHERIT_TAG}:`.length));

		if (parentNames.length === 0) return;

		for (const parentName of parentNames) {
			const parent = byName.get(parentName);

			if (!parent) {
				console.warn(`  warn: ${moonwaveClass.name} tried to inherit from unknown class '${parentName}'`);
				
				continue;
			}

			resolve(parent, visited);

			moonwaveClass.inherited = {
				...moonwaveClass.inherited,
				[parent.name]: {
					functions: parent.functions,
					properties: parent.properties,
				},
			};

			console.log(`  ${moonwaveClass.name} inherits ${parent.name}`);
		}
	}

	for (const moonwaveClass of all) {
		resolve(moonwaveClass);
	}
}

// #endregion

// #region MDX generation

function mdxComment(text: string) {
	return `[//]: # (${text})\n`;
}

function escapeDesc(text: string) {
	return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function declarationComponent(
	funcName: string,
	className: string,
	isMethod: boolean,
	params: MoonwaveFunction["params"],
	returnType?: string,
) {
	const sanitize = (input: string) => (input ?? "").trim().replace(/\s+/g, " ").replace(/"/g, "&quot;");
	const parameterList = params.map(param => `{ name: "${param.name}", type: "${sanitize(param.lua_type)}" }`);
	let attributes = `name="${funcName}" className="${className}" args={[ ${parameterList.join(", ")} ]}`;
	if (returnType) attributes += ` returnType="${sanitize(returnType)}"`;
	if (isMethod) attributes += " isMethod";
	return `> <LuaDeclaration ${attributes} />`;
}

function propertyComponent(name: string, type: string) {
	return `<LuaProperty name="${name}" type="${type}" />`;
}

function propertiesSection(
	className: string,
	own: MoonwaveProperty[],
	inherited: MoonwaveClass["inherited"],
) {
	const hasAny = own.length > 0 || Object.values(inherited ?? {}).some(data => data.properties.length > 0);
	if (!hasAny) return "";

	let markdown = "## Properties\n\n";

	for (const property of own) {
		markdown += `### ${property.name}\n\n`;
		markdown += propertyComponent(`${className}.${property.name}`, property.lua_type) + "\n\n";
		if (property.desc) markdown += `---\n${escapeDesc(property.desc)}\n`;
		markdown += "\n";
	}

	for (const [parentName, data] of Object.entries(inherited ?? {})) {
		for (const property of data.properties) {
			markdown += `### ${property.name}\n\n`;
			markdown += propertyComponent(`${className}.${property.name}`, property.lua_type) + "\n\n";
			if (property.desc) markdown += `---\n${escapeDesc(property.desc)}\n`;
			markdown += "\n";
			markdown += `> Inherited from [${parentName}](${parentName})\n\n`;
		}
	}

	return markdown;
}

function functionsSection(
	className: string,
	own: MoonwaveFunction[],
	inherited: MoonwaveClass["inherited"],
	type: "method" | "static",
) {
	const isVisible = (func: MoonwaveFunction) => !func.private && func.function_type === type;

	const ownFiltered = own.filter(isVisible);
	const hasAny =
		ownFiltered.length > 0 ||
		Object.values(inherited ?? {}).some(data => data.functions.some(isVisible));

	if (!hasAny) return "";

	const heading = type === "method" ? "## Methods\n\n" : "## Functions\n\n";
	let markdown = heading;

	for (const func of ownFiltered) {
		markdown += `### ${func.name}\n\n`;
		markdown += declarationComponent(func.name, className, type === "method", func.params, func.returns[0]?.lua_type) + "\n";
		if (func.desc) markdown += "\n" + escapeDesc(func.desc) + "\n";
		markdown += "\n";
	}

	for (const [parentName, data] of Object.entries(inherited ?? {})) {
		const inheritedFunctions = data.functions.filter(isVisible);
		for (const func of inheritedFunctions) {
			markdown += `### ${func.name}\n\n`;
			markdown += declarationComponent(func.name, className, type === "method", func.params, func.returns[0]?.lua_type) + "\n";
			if (func.desc) markdown += "\n" + escapeDesc(func.desc) + "\n";
			markdown += "\n";
			markdown += `> Inherited from [${parentName}](${parentName})\n\n`;
		}
	}

	return markdown;
}

function generateMdx(moonwaveClass: MoonwaveClass, isIndex = false): string {
	const rawName = moonwaveClass.name.split(".").pop()!;
	const className = rawName.charAt(0).toUpperCase() + rawName.slice(1);
	const parts = moonwaveClass.name.split(".");
	const order = parts.length === 2 ? 100 : 1;

	let markdown = "";

	const sidebarBlock = isIndex
		? `sidebar:\n  label: Overview\n  order: ${INDEX_SIDEBAR_ORDER}`
		: `sidebar:\n  order: ${order}`;
	markdown += `---\ntitle: ${className}\ndescription: DiscordLuau docs for ${className}.\n${sidebarBlock}\n---\n\n`;
	markdown += mdxComment("This file was @generated from moonwave comments. Do not edit by hand.");
	markdown += mdxComment("To edit docs, change the source comments in the DiscordLuau repo.");
	markdown += "\n";
	markdown += `import LuaDeclaration from '${LUA_DECLARATION_COMPONENT}';\n`;
	markdown += `import LuaProperty from '${LUA_PROPERTY_COMPONENT}';\n`;
	markdown += "\n";
	markdown += escapeDesc(moonwaveClass.desc) + "\n\n";

	const properties = propertiesSection(className, moonwaveClass.properties, moonwaveClass.inherited);
	const methods = functionsSection(className, moonwaveClass.functions, moonwaveClass.inherited, "method");
	const functions = functionsSection(className, moonwaveClass.functions, moonwaveClass.inherited, "static");

	if (properties) markdown += properties + "\n";
	if (methods) markdown += methods + "\n";
	if (functions) markdown += functions + "\n";

	return markdown;
}

// #endregion

// #region File writing

function writeClass(moonwaveClass: MoonwaveClass, all: MoonwaveClass[]) {
	const path = classNameToPath(moonwaveClass.name, all);
	const isIndex = path.endsWith("/index.mdx");
	
	mkdirSync(dirname(path), { recursive: true });
	writeFileSync(path, generateMdx(moonwaveClass, isIndex), FILE_ENCODING);

	return path;
}

// #endregion

// #region Docs sync

function syncDocs() {
	mkdirSync(GENERATED_DIR, { recursive: true });

	if (!existsSync(DISCORD_LUAU_DOCS_DIR)) {
		console.warn(`  warn: '${DISCORD_LUAU_DOCS_DIR}' not found - is the discord-luau submodule initialized?`);
		writeFileSync(SYNCED_DIRS_PATH, JSON.stringify([]), FILE_ENCODING);
		return;
	}

	const sourceDirectories = readdirSync(DISCORD_LUAU_DOCS_DIR, { withFileTypes: true })
		.filter(entry => entry.isDirectory());

	const sourceDirectoryNames = new Set(sourceDirectories.map(entry => entry.name));

	if (existsSync(CONTENT_DOCS_DIR)) {
		const staleDirectories = readdirSync(CONTENT_DOCS_DIR, { withFileTypes: true })
			.filter(entry => entry.isDirectory() && !sourceDirectoryNames.has(entry.name) && `${CONTENT_DOCS_DIR}/${entry.name}` !== CLASSES_DIR);

		for (const staleDirectory of staleDirectories) {
			rmSync(`${CONTENT_DOCS_DIR}/${staleDirectory.name}`, { recursive: true });

			console.log(`  removed stale ${CONTENT_DOCS_DIR}/${staleDirectory.name}`);
		}
	}

	for (const directory of sourceDirectories) {
		const source = `${DISCORD_LUAU_DOCS_DIR}/${directory.name}`;
		const destination = `${CONTENT_DOCS_DIR}/${directory.name}`;

		if (existsSync(destination)) rmSync(destination, { recursive: true });
		
		cpSync(source, destination, { recursive: true });

		console.log(`  synced ${source} → ${destination}`);
	}

	writeFileSync(SYNCED_DIRS_PATH, JSON.stringify(sourceDirectories.map(directory => directory.name)), FILE_ENCODING);
}

// #endregion

// #region Main

function main() {
	console.log("Syncing docs from discord-luau repo...");
	syncDocs();

	if (existsSync(CLASSES_DIR)) rmSync(CLASSES_DIR, { recursive: true });
	mkdirSync(CLASSES_DIR, { recursive: true });

	console.log("Extracting moonwave data...");
	const classes = extract();
	console.log(`Found ${classes.length} classes.\n`);

	console.log("Processing inheritance...");
	resolveInheritance(classes);

	console.log("\nGenerating MDX files...");
	let written = 0;
	for (const moonwaveClass of classes) {
		const path = writeClass(moonwaveClass, classes);
		console.log(`  ${moonwaveClass.name} → ${path}`);
		written++;
	}

	writeFileSync(
		CLASS_REGISTRY_PATH,
		JSON.stringify(classes.map(moonwaveClass => moonwaveClass.name)),
		FILE_ENCODING,
	);

	console.log(`\nDone. ${written} files written.`);
}

// #endregion

main();
