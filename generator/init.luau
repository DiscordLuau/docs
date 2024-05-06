local Moonwave = require("Moonwave")
local Generator = require("Generator")
local Markdown = require("Markdown")

local packageCommentJson = Moonwave.extractCommentsIntoJson()

for _, classDocumentation in packageCommentJson do
	local documentPath = Generator.writeClassName(classDocumentation.name)
	local documentContent = Markdown.generateMarkdownDocumentFor(classDocumentation)

	print(`Writing document '{classDocumentation.name}' to '{documentPath}', size: {string.len(documentContent)}`)

	Generator.writeClassContent(documentPath, documentContent)
end