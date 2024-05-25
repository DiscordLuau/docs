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

local function frontmatter(source: {
	name: string,
	description: string,
})
	return `---\ntitle: {source.name}\ndescription: {source.description}\n---`
end

local function getReadableParamList(proto: Moonwave.moonwaveFunctionData)
	local readableList = " "

	if #proto.params == 0 then
		return ""
	end

	for index, paramObject in proto.params do
		readableList ..= `\`{paramObject.name}\` {Types.parseLuauType(paramObject.lua_type, true)}` .. (index == #proto.params and ` ` or `, `)
	end

	return readableList
end

local function getReadableReturnsList(proto: Moonwave.moonwaveFunctionData)
	local readableList = " "

	if #proto.returns == 0 then
		return Types.parseLuauType("nil")
	end

	for index, returnObject in proto.returns do
		readableList ..= `{Types.parseLuauType(returnObject.lua_type, true)}` .. (index == #proto.returns and ` ` or `, `)
	end

	return readableList
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

	markdownFile ..= input(classDescription)

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT PROPERTIES ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Properties`)

	if #classProperties > 0 then
		for _, property in classProperties do
			markdownFile ..= h3(property.name)
			markdownFile ..= input(
				` \`\`\`lua\n {className}.{property.name} :: {Types.parseLuauType(property.lua_type)}\n\`\`\`\n`
			)

			if property.desc ~= "" then
				markdownFile ..= separator()
				markdownFile ..= input(property.desc)
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
			markdownFile ..= input(
				` \`\`\`lua\n > {className}:{method.name}({getReadableParamList(method)}) -> {getReadableReturnsList(method)}\n\`\`\`\n`
			)

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
			markdownFile ..= input(
				`> {className}.{func.name}({getReadableParamList(func)}) -> {getReadableReturnsList(func)}`
			)

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
