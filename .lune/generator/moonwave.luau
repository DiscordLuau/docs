local process = require("@lune/process")
local serde = require("@lune/serde")

local Moonwave = {}

function Moonwave.filterOutVendorModules(moonwaveData)
	local pointer = 0

	for index, object in table.clone(moonwaveData) do
		local objectPath = object.source.path

		if string.find(objectPath, "/Vendor/Embedded") then
			table.remove(moonwaveData, index - pointer)

			pointer += 1
		end
	end

	return moonwaveData
end

function Moonwave.getFunctionsOfFunctionType(inputArray: { any }, functionType: string)
	local resultArray = {}

	for _, functionObject in inputArray do
		if functionObject.function_type == functionType then
			table.insert(resultArray, functionObject)
		end
	end

	return resultArray
end

function Moonwave.extractCommentsIntoJson(): moonwaveDataExportArray
	local moonwaveExtractResult = process.spawn("extern/moonwave-extractor", {
		"extract",
		"discord-luau/packages/"
	})

	if not moonwaveExtractResult.ok then
		error(moonwaveExtractResult.stderr)
	else
		local moonwaveData = serde.decode("json", moonwaveExtractResult.stdout)

		moonwaveData = Moonwave.filterOutVendorModules(moonwaveData)

		return moonwaveData
	end
end

export type moonwavePropertyData = {
	name: string,
	desc: string,
	lua_type: string,
	source: {
		line: number,
		path: string,
	},
}

export type moonwaveFunctionData = {
	name: string,
	desc: string,
	since: string?,
	unreleased: boolean?,
	source: {
		path: string,
		line: number,
	},
	function_type: "method" | "static",
	returns: {
		{
			desc: string,
			lua_type: string,
		}
	},
	params: {
		{
			name: string,
			desc: string,
			lua_type: string,
		}?
	},
}

export type moonwaveDataExportObject = {
	name: string,
	functions: { moonwaveFunctionData? },
	source: { path: string, line: number },
	properties: { moonwavePropertyData? },
	inherited: { [string]: { functions: { moonwaveFunctionData? }, properties: { moonwavePropertyData? } } }?,
	desc: string,
	types: unknown,
	tags: { string }?
}

export type moonwaveDataExportArray = {
	moonwaveDataExportObject
}

return Moonwave