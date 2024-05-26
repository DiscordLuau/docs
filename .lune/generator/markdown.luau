local Moonwave = require("moonwave")
local Types = require("types")

local Markdown = {}

local function comment(source)
	return `[//]: # ({source})\n`
end

local function newline()
	return `\n`
end

local function h2(source)
	return `## {source}\n\n`
end

local function h3(source)
	return `### {source}\n\n`
end

local function input(source)
	return `{source}\n`
end

local function separator()
	return `---\n`
end

local function import(component)
	return `import {component} from '$/components/{component}.astro';\n`
end

local function declaration(functionName, className, isMethod, parameters, returnType: string?)
	local argumentComponents = {}

	for index, paramObject in parameters do
		table.insert(argumentComponents, `\{ name: "{paramObject.name}", type: "{paramObject.lua_type}" }`)
	end

	local formattedProps = `name="{functionName}" className="{className}" args=\{[ {table.concat(argumentComponents, ", ")} ]}`
	
	if returnType then
		formattedProps ..= ` returnType="{returnType}"`
	end

	if isMethod then 
		formattedProps ..= " isMethod"
	end

	return `> <LuaDeclaration {formattedProps} />`
end

local function property(name: string, type: string)
	return `<LuaProperty name="{name}" type="{type}" />`
end

local function frontmatter(source: {
	name: string,
	description: string,
})
	return `---\ntitle: {source.name}\ndescription: {source.description}\n---`
end

function Markdown.generateMarkdownDocumentFor(classDocumentation: Moonwave.moonwaveDataExportObject)
	local markdownFile = ``

	local className = classDocumentation.name:gmatch("%S+%.(%S+)")() or classDocumentation.name
	local classDescription = classDocumentation.desc
	local classProperties = classDocumentation.properties

	local classMethods = Moonwave.getFunctionsOfFunctionType(classDocumentation.functions, "method")
	local classFunctions = Moonwave.getFunctionsOfFunctionType(classDocumentation.functions, "static")

	markdownFile ..= frontmatter({
		name = className,
		description = `DiscordLuau docs for {className}.`,
	})

	markdownFile ..= newline()

	markdownFile ..= comment(
		`This file was automatically compiled through the Generator luau code under this repository`
	)
	markdownFile ..= comment(`if you want to edit the documentation of discord-luau, please write changes`)
	markdownFile ..= comment(
		`to the discord-luau repository itself, we extract the comments from discord-luau and translate`
	)
	markdownFile ..= comment(`them into markdown files that Nextra can interpret!`)

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT IMPORTS ----- `)

	markdownFile ..= newline()

	markdownFile ..= import("LuaDeclaration")
	markdownFile ..= import("LuaProperty")

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT DESCRIPTION ----- `)

	markdownFile ..= newline()

	markdownFile ..= input(classDescription)

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT PROPERTIES ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Properties`)

	if #classProperties > 0 then
		for _, prop in classProperties do
			markdownFile ..= h3(prop.name)
			markdownFile ..= property(`{className}.{prop.name}`, prop.lua_type)
			markdownFile ..= newline()

			if prop.desc ~= "" then
				markdownFile ..= separator()
				markdownFile ..= input(prop.desc)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set properties!`)
	end

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT METHODS ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Methods`)

	if #classMethods > 0 then
		for _, method in classMethods do
			markdownFile ..= h3(method.name)
			markdownFile ..= declaration(method.name, className, true, method.params, (method.returns[1] or {lua_type = nil}).lua_type)

			if method.desc then
				markdownFile ..= newline()
				markdownFile ..= input(method.desc)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set methods!`)
	end

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT FUNCTIONS ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Functions`)

	if #classFunctions > 0 then
		for _, func in classFunctions do
			markdownFile ..= h3(func.name)
			markdownFile ..= declaration(func.name, className, false, func.params)		

			if func.desc then
				markdownFile ..= newline()
				markdownFile ..= input(func.desc)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set functions!`)
	end

	markdownFile ..= newline()

	return markdownFile
end

return Markdown