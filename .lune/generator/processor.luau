local Moonwave = require("moonwave")
local Tags = require("tags")

local Processor = {}

function Processor.getObjectFromName(packageCommentJson: Moonwave.moonwaveDataExportArray, packageName: string): processedMoonwaveDataExportObject?
	for _, object in packageCommentJson do
		if object.name == packageName then
			return object
		end
	end

	return nil
end

function Processor.processInheritedObject(packageCommentJson: Moonwave.moonwaveDataExportArray, packageObject: processedMoonwaveDataExportObject)
	if packageObject._processed then
		return packageObject
	end
	
	local packageTags, tagCount = Tags.getTags(packageObject)
	
	if tagCount == 0 then 
		packageObject._processed = true

		return packageObject
	end

	for tagName, tagArguments in packageTags do
		if tagName == "inherit" then
			local inheritedPackageObject = Processor.getObjectFromName(packageCommentJson, tagArguments[1])

			assert(packageObject, `Object '{packageObject.name}' attempted to inherit from invalid class: '{inheritedPackageObject}'`)

			local processedPackageObject = Processor.processInheritedObject(packageCommentJson, inheritedPackageObject)

			if not packageObject.inherited then
				packageObject.inherited = {}
			end

			(packageObject.inherited :: { })[processedPackageObject.name] = {
				properties = processedPackageObject.properties,
				functions = processedPackageObject.functions
			}

			print(`{packageObject.name} INHERITS FROM {processedPackageObject.name}`)
		else
			warn(`Unknown tag '{packageTags}'`)
		end
	end

	packageObject._processed = true

	return packageObject
end

function Processor.processInheritedObjects(packageCommentJson: Moonwave.moonwaveDataExportArray)
	for _, object in packageCommentJson do
		Processor.processInheritedObject(packageCommentJson, object)
	end

	return packageCommentJson
end

type processedMoonwaveDataExportObject = Moonwave.moonwaveDataExportObject & {
	_processed: boolean?
}

return Processor