const _ = require('lodash');
const fs = require('fs');

//JSON
let originalJSON = fs.readFileSync('./json_samples/original.json');
let modifiedJSON = fs.readFileSync('./json_samples/modified.json');

//Object
let originalObject = JSON.parse(originalJSON);
let modifiedObject = JSON.parse(modifiedJSON);

const difference = (originalObject, modifiedObject) => {
	const changes = (modifiedObject, originalObject) => {
		let arrayIndexCounter = 0;
		return _.transform(modifiedObject, function (result, value, key) {
			if (!_.isEqual(value, originalObject[key])) {
				let resultKey = _.isArray(originalObject)
					? arrayIndexCounter++
					: key;
				result[resultKey] =
					_.isObject(value) && _.isObject(originalObject[key])
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
