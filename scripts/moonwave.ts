import { spawnSync } from "node:child_process";
import { readdirSync, existsSync } from "node:fs";

export interface MoonwaveSource {
	line: number;
	path: string;
}

export interface MoonwaveParam {
	name: string;
	desc: string;
	lua_type: string;
}

export interface MoonwaveReturn {
	desc: string;
	lua_type: string;
}

export interface MoonwaveFunction {
	name: string;
	desc: string;
	function_type: "method" | "static";
	params: MoonwaveParam[];
	returns: MoonwaveReturn[];
	private?: boolean;
	source: MoonwaveSource;
}

export interface MoonwaveProperty {
	name: string;
	desc: string;
	lua_type: string;
	source: MoonwaveSource;
}

export interface MoonwaveType {
	name: string;
	desc: string;
	source: MoonwaveSource;
}

export interface MoonwaveExternalType {
	name: string;
	url: string;
}

export interface MoonwaveClass {
	name: string;
	desc: string;
	source: MoonwaveSource;
	functions: MoonwaveFunction[];
	properties: MoonwaveProperty[];
	types: MoonwaveType[];
	tags?: string[];
	unreleased?: boolean;
	external_types?: MoonwaveExternalType[];
	inherited?: Record<
		string,
		{ functions: MoonwaveFunction[]; properties: MoonwaveProperty[] }
	>;
}

export function extract(): MoonwaveClass[] {
	const packagesDir = "discord-luau/packages";
	const packageDirs = readdirSync(packagesDir, { withFileTypes: true })
		.filter(entry => entry.isDirectory())
		.map(entry => `${packagesDir}/${entry.name}/src`)
		.filter(srcPath => existsSync(srcPath));

	const allClasses: MoonwaveClass[] = [];

	for (const srcPath of packageDirs) {
		const result = spawnSync(
			"mise",
			["exec", "--", "moonwave", "extract", "--base", packagesDir, srcPath],
			{ encoding: "utf-8", maxBuffer: 64 * 1024 * 1024 },
		);

		if (result.status !== 0) {
			throw new Error(
				`Moonwave extraction failed for ${srcPath}:\n${result.stderr}`,
			);
		}

		const data: MoonwaveClass[] = JSON.parse(result.stdout);
		allClasses.push(...data);
	}

	return allClasses.filter(
		cls => !cls.source.path.includes("/Vendor/Embedded"),
	);
}
