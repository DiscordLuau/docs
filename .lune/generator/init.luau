local Moonwave = require("moonwave")
local Generator = require("generator")
local Markdown = require("markdown")
local Processor = require("processor")

Generator.removeLegacyFiles()

local packageCommentJson = Moonwave.extractCommentsIntoJson()

packageCommentJson = Processor.processInheritedObjects(packageCommentJson)

for _, classDocumentation in packageCommentJson do
	local documentPath = Generator.writeClassName(classDocumentation.name)
	local documentContent = Markdown.generateMarkdownDocumentFor(classDocumentation)

	print(`Writing document '{classDocumentation.name}' to '{documentPath}', size: {string.len(documentContent)}`)

	Generator.writeClassContent(documentPath, documentContent)
end

return {}