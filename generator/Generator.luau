local fs = require("@lune/fs")
local serde = require("@lune/serde")
local net = require("@lune/net")

local Generator = {}

function Generator.writeClassName(className: string)
	local classPath = string.split(className, ".")
	local fullPath = "pages/Classes/"

	local fileName = table.remove(classPath, #classPath)
	local netSafeFileName = net.urlEncode(fileName, false)

	for index, path in classPath do
		if not fs.isDir(fullPath .. path) then
			print(`Created directory: '{fullPath .. path}'`)

			fs.writeDir(fullPath .. path)
		end

		fullPath ..= `{path}/`
	end

	print(fullPath .. `{netSafeFileName}.mdx`, ``)
	fs.writeFile(fullPath .. `{netSafeFileName}.mdx`, ``)

	if fs.isFile(fullPath .. "_meta.json") then
		local jsonData = serde.decode("json", fs.readFile(fullPath .. "_meta.json"))

		jsonData[`{netSafeFileName}`] = fileName

		fs.writeFile(fullPath .. "_meta.json", serde.encode("json", jsonData, true))
	else
		fs.writeFile(fullPath .. "_meta.json", serde.encode("json", {
			[`{netSafeFileName}`] = fileName
		}, true))
	end

	return fullPath .. `{netSafeFileName}.mdx`
end

function Generator.writeClassContent(classPath: string, classContent: string)
	fs.writeFile(classPath, classContent)
end

return Generator