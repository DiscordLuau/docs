local Moonwave = require("moonwave")
local Generator = require("generator")
local Markdown = require("markdown")

Generator.removeLegacyFiles()

local packageCommentJson = Moonwave.extractCommentsIntoJson()

for _, classDocumentation in packageCommentJson do
	local documentPath = Generator.writeClassName(classDocumentation.name)
	local documentContent = Markdown.generateMarkdownDocumentFor(classDocumentation)

	print(`Writing document '{classDocumentation.name}' to '{documentPath}', size: {string.len(documentContent)}`)

	Generator.writeClassContent(documentPath, documentContent)
end

return {}