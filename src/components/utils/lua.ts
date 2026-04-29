import registryJson from "../../generated/class-registry.json";

const LUA_DOCS_BASE_URL = "https://www.lua.org/pil";

const classRegistryByLowerName = new Map<string, string>(
	registryJson.map(name => [name.toLowerCase(), name]),
);

const classRegistryByPrefixAndLastSegment = new Map<string, string>(
	registryJson.map(name => {
		const parts = name.toLowerCase().split(".");
		return [`${parts[0]}:${parts[parts.length - 1]}`, name];
	}),
);

export type LuaParam = {
	name: string;
	type: string;
};

export const luaTypeDocs: Record<string, string> = {
	nil: "2.1",
	boolean: "2.2",
	bool: "2.2",
	number: "2.3",
	string: "2.4",
	table: "2.5",
	tuple: "5.1",
	"...": "5.1",
	userdata: "28.1",
	proxy: "28.1",
};

export const removeTypeModifiers = (type: string) => type.replaceAll(/\?/g, "");

export const stripNamespace = (type: string) => {
	const lastDot = type.lastIndexOf(".");
	return lastDot >= 0 ? type.slice(lastDot + 1) : type;
};

export const stripNamespaceFromType = (type: string) =>
	type.replace(/[^\s<>,{}]+\.[^\s<>,{}]+/g, match => stripNamespace(match));

export const getLuaDocs = (luaType: string) => {
	const url = new URL(LUA_DOCS_BASE_URL);
	url.pathname += `/${luaTypeDocs[luaType]}.html`;
	return url.toString();
};

const buildClassPath = (registryName: string) =>
	`/classes/${registryName
		.split(".")
		.map(namePart => namePart.toLowerCase())
		.join("/")}`;

const vendorTypeDocs: Record<string, string> = {
	"future.futurelike": "/vendor/futures",
	futurelike: "/vendor/futures",
};

export const getCustomTypeDocs = (type: string) => {
	if (type === "()" || type === "any") return null;
	const lowerType = type.toLowerCase();

	const vendorMatch = vendorTypeDocs[lowerType];
	if (vendorMatch) return vendorMatch;

	const exactMatch = classRegistryByLowerName.get(lowerType);
	if (exactMatch) return buildClassPath(exactMatch);

	const typeParts = lowerType.split(".");
	if (typeParts.length >= 2) {
		const prefixAndLastSegment = `${typeParts[0]}:${typeParts[typeParts.length - 1]}`;
		const fuzzyMatch = classRegistryByPrefixAndLastSegment.get(prefixAndLastSegment);
		if (fuzzyMatch) return buildClassPath(fuzzyMatch);
	}

	return null;
};

export const getTypeDocs = (type: string) => {
	const normalized = removeTypeModifiers(type);
	return normalized in luaTypeDocs ? getLuaDocs(normalized) : getCustomTypeDocs(normalized);
};

export const typeOrDefault = (type?: string) => type ?? "()";

export const getKvPairs = (tableInner: string) =>
	tableInner
		.trim()
		.split(",")
		.map(pair => pair.split(":").map(part => part.trim()))
		.filter(pair => pair[0] !== "" && pair[1] !== undefined);

export const isObject = (tableInner: string) => tableInner.match(/(.*):(.*)/) !== null;
