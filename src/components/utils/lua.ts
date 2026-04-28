import registryJson from "../../generated/class-registry.json";

const LUA_DOCS_BASE_URL = "https://www.lua.org/pil";

const classRegistryByLowerName = new Map<string, string>(
	registryJson.map(name => [name.toLowerCase(), name]),
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

export const getLuaDocs = (luaType: string) => {
	const url = new URL(LUA_DOCS_BASE_URL);
	url.pathname += `/${luaTypeDocs[luaType]}.html`;
	return url.toString();
};

export const getCustomTypeDocs = (type: string) => {
	if (type === "()" || type === "any") return null;
	const registryName = classRegistryByLowerName.get(type.toLowerCase());
	if (!registryName) return null;
	const path = `/classes/${registryName
		.split(".")
		.map(namePart => namePart.toLowerCase())
		.join("/")}`;
	return path;
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
