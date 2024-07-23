export type LuaType =
	| "nil"
	| ("boolean" | "bool")
	| "number"
	| "string"
	| "table"
	| ("tuple" | "...")
	| ("userdata" | "proxy");

export type LuaParam = {
	name: string;
	type: LuaType | string;
};

export const luaTypeDocs: Record<LuaType, string> = {
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

export const removeTypeModifiers = (type: string) => {
	return type.replaceAll(/\?/g, "") as LuaType;
};

export const getLuaDocs = (luaType: LuaType) => {
	const luaDocsBaseUrl = new URL("https://www.lua.org/pil");
	luaDocsBaseUrl.pathname += `/${luaTypeDocs[luaType]}.html`;

	return luaDocsBaseUrl.toString();
};

export const getCustomTypeDocs = (type: string) => {
	if (type === "()" || type === "any") {
		return null;
	}

	const path =
		`/classes/${type
			.split(".")
			.map((component) => component.toLocaleLowerCase())
			.join("/")}`
		

	return path;
};

export const getTypeDocs = (type: string) => {
	const normalizedType = removeTypeModifiers(type);
	
	return normalizedType in luaTypeDocs
		? getLuaDocs(normalizedType)
		: getCustomTypeDocs(type);
};

export const typeOrDefault = (type?: string) => {
	return type ?? "()";
};

export const getKvPairs = (tblInner: string) => {
	tblInner = tblInner.trim();
	const pairs = tblInner
		.split(",")
		.map((pair) => pair.split(":").map((elem) => elem.trim()));

	return pairs;
};

export const isObject = (tblInner: string) => {
	return tblInner.match(/(.*):(.*)/) !== null;
};
