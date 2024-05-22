local fs = require("@lune/fs")
local net = require("@lune/net")

local Generator = {}

function Generator.removeLegacyFiles()
	if fs.isDir("src/content/docs/classes") then
		fs.removeDir("src/content/docs/classes")
	end

	fs.writeDir("src/content/docs/classes")
end

function Generator.writeClassName(className: string)
	local classPath = string.split(className, ".")
	local fullPath = "src/content/docs/classes/"

	local fileName = table.remove(classPath, #classPath)
	local netSafeFileName = net.urlEncode(fileName, false)

	for index, path in classPath do
		if not fs.isDir(fullPath .. path) then
			fs.writeDir(fullPath .. path)
		end

		fullPath ..= `{path}/`
	end

	fs.writeFile(fullPath .. `{netSafeFileName}.mdx`, ``)
	return fullPath .. `{netSafeFileName}.mdx`
end

function Generator.writeClassContent(classPath: string, classContent: string)
	fs.writeFile(classPath, classContent)
end

return Generator
