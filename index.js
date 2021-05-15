const fs = require('fs');

//Please require lodash utils functions only in modular way to
const _transform = require('lodash').transform;
const _isEqual = require('lodash').isEqual;
const _isObject = require('lodash').isObject;
const _isArray = require('lodash').isArray;

//JSON fetching
let originalJSON = fs.readFileSync('./json_samples/original.json');
let modifiedJSON = fs.readFileSync('./json_samples/modified.json');

//JSON to Object Conversion
let originalObject = JSON.parse(originalJSON);
let modifiedObject = JSON.parse(modifiedJSON);

/**
 * Function difference is used to generate diff object between the two object according structure
 * @param {*} originalObject
 * @param {*} modifiedObject
 * @returns Object
 */
const difference = (originalObject, modifiedObject) => {
	const changes = (modifiedObject, originalObject) => {
		let arrayIndexCounter = 0;
		return _transform(modifiedObject, function (result, value, key) {
			if (!_isEqual(value, originalObject[key])) {
				let resultKey = _isArray(originalObject)
					? arrayIndexCounter++
					: key;
				result[resultKey] =
					_isObject(value) && _isObject(originalObject[key])
						? changes(value, originalObject[key])
						: value;
			}
		});
	};
	return changes(modifiedObject, originalObject);
};

const differenceObject = difference(originalObject, modifiedObject);
//console.log(differenceObject);
const differenceData = JSON.stringify(differenceObject, '', 2);
fs.writeFileSync('./json_samples/difference.json', differenceData);
