local Moonwave = require("moonwave")

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
	order: number,
})
	return `---\ntitle: {source.name}\ndescription: {source.description}\nsidebar:\n order: {source.order}\n collapsed: true\n---`
end

function Markdown.generateMarkdownDocumentFor(classDocumentation: Moonwave.moonwaveDataExportObject)
	local markdownFile = ``

	local className = classDocumentation.name:gmatch("%S+%.(%S+)")() or classDocumentation.name
	local classDescription = classDocumentation.desc
	local classProperties = classDocumentation.properties

	local classMethods = Moonwave.getFunctionsOfFunctionType(classDocumentation.functions, "method")
	local classFunctions = Moonwave.getFunctionsOfFunctionType(classDocumentation.functions, "static")

	local sizeOfClassProperties = #classProperties

	local sizeOfClassMethods = #classMethods
	local sizeOfClassFunctions = #classFunctions

	local inheritedClasses = classDocumentation.inherited ~= nil and classDocumentation.inherited or { }

	local order = #string.split(classDocumentation.name, ".")

	for _, classObject in inheritedClasses do
		sizeOfClassProperties += #classObject.properties

		for _, functionObject in classObject.functions do
			if functionObject.function_type == "method" then
				sizeOfClassMethods += 1
			else
				sizeOfClassFunctions += 1
			end
		end
	end

	markdownFile ..= frontmatter({
		name = className,
		description = `DiscordLuau docs for {className}.`,
		order = order,
	})

	markdownFile ..= newline()

	markdownFile ..= comment(
		`This file was automatically @generated from moonwave comments using a script. Please do not exit by hand.`
	)
	markdownFile ..= comment(`To actually edit documentation, make changes to the main DiscordLuau repo.`)

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

	if sizeOfClassProperties > 0 then
		for _, prop in classProperties do
			markdownFile ..= h3(prop.name)
			markdownFile ..= property(`{className}.{prop.name}`, prop.lua_type)
			markdownFile ..= newline()

			if prop.desc ~= "" then
				markdownFile ..= separator()
				markdownFile ..= input(prop.desc)
			end
		end

		for inheritedClassName, classInheritedData in inheritedClasses do
			for _, inheritedProperty in classInheritedData.properties do
				markdownFile ..= h3(inheritedProperty.name)
				markdownFile ..= property(`{className}.{inheritedProperty.name}`, inheritedProperty.lua_type)
				markdownFile ..= newline()

				if inheritedProperty.desc ~= "" then
					markdownFile ..= separator()
					markdownFile ..= input(inheritedProperty.desc)
				end

				markdownFile ..= newline()
				markdownFile ..= input(`> This property was inherited from [{inheritedClassName}]({inheritedClassName})`)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set properties!`)
	end

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT METHODS ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Methods`)

	if sizeOfClassMethods > 0 then
		for _, method in classMethods do
			markdownFile ..= h3(method.name)
			markdownFile ..= declaration(method.name, className, true, method.params, (method.returns[1] or {lua_type = nil}).lua_type)

			if method.desc then
				markdownFile ..= newline()
				markdownFile ..= input(method.desc)
			end
		end

		for inheritedClassName, classInheritedData in inheritedClasses do
			for _, inheritedFunction in classInheritedData.functions do
				if inheritedFunction.function_type ~= "method" then
					continue
				end

				markdownFile ..= h3(inheritedFunction.name)
				markdownFile ..= declaration(inheritedFunction.name, className, true, inheritedFunction.params, (inheritedFunction.returns[1] or {lua_type = nil}).lua_type)

				if inheritedFunction.desc then
					markdownFile ..= newline()
					markdownFile ..= input(inheritedFunction.desc)
				end

				markdownFile ..= newline()
				markdownFile ..= input(`> This function was inherited from [{inheritedClassName}]({inheritedClassName})`)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set methods!`)
	end

	markdownFile ..= newline()

	markdownFile ..= comment(`----- DOCUMENT FUNCTIONS ----- `)

	markdownFile ..= newline()

	markdownFile ..= h2(`Functions`)

	if sizeOfClassFunctions > 0 then
		for _, func in classFunctions do
			markdownFile ..= h3(func.name)
			markdownFile ..= declaration(func.name, className, false, func.params)		

			if func.desc then
				markdownFile ..= newline()
				markdownFile ..= input(func.desc)
			end
		end

		for inheritedClassName, classInheritedData in inheritedClasses do
			for _, inheritedFunction in classInheritedData.functions do
				if inheritedFunction.function_type ~= "static" then
					continue
				end

				markdownFile ..= h3(inheritedFunction.name)
				markdownFile ..= declaration(inheritedFunction.name, className, false, inheritedFunction.params)		
	
				if inheritedFunction.desc then
					markdownFile ..= newline()
					markdownFile ..= input(inheritedFunction.desc)
				end

				markdownFile ..= newline()
				markdownFile ..= input(`> This function was inherited from [{inheritedClassName}]({inheritedClassName})`)
			end
		end
	else
		markdownFile ..= input(`The {className} instance has no set functions!`)
	end

	markdownFile ..= newline()

	return markdownFile
end

return Markdown