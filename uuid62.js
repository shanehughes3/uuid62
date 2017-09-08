'use strict';

const uuid = require('uuid');
const baseX = require('base-x');
const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')

// expose node-uuid and baseX for convenience
module.exports.uuid = uuid;
module.exports.baseX = baseX;
module.exports.customBase = base62;
module.exports.length = 22;
module.exports.uuidLength = 32;
exports.v4 = v4;
exports.v1 = v1;
exports.encode = encode;
exports.decode = decode;

function v4() {
	const args = Array.prototype.slice.call(arguments);

	if (!args[1]) {
		// make sure we use a buffer to avoid getting an uuid with dashes
		args[1] = new Buffer(16);
	}

	const id = uuid.v4.apply(this, args);
	return encode(id);
};


function v1() {
	const args = Array.prototype.slice.call(arguments);

	if (!args[1]) {
		// make sure we use a buffer to avoid getting an uuid with dashes
		args[1] = new Buffer(16);
	}

	const id = uuid.v1.apply(this, args);
	return encode(id);
};


function encode(input, encoding) {
	encoding = encoding || 'hex';

	if (typeof input === 'string') {
		// remove the dashes to save some space
		input = new Buffer(input.replace(/-/g, ''), encoding);
	}
	return ensureLength(base62.encode(input), module.exports.length);
};

function decode(b62Str, encoding) {
	encoding = encoding || 'hex';
	const res = ensureLength(new Buffer(base62.decode(b62Str)).toString(encoding), module.exports.uuidLength);

	// re-add the dashes so the result looks like an uuid
	const resArray = res.split('');
	[8, 13, 18, 23].forEach((idx) => {
		resArray.splice(idx, 0, '-');
	});
	return resArray.join('');
};

function ensureLength(str, maxLen) {
	str = str + '';
	if (str.length < maxLen) {
		return padLeft(str, maxLen);
	}
	else if (str.length > maxLen) {
		return trimLeft(str, maxLen);
	}
	return str;
};


function padLeft(str, padding) {
	str = str + '';
	let pad = '';
	for (let i = str.length; i < padding; ++i) {
		pad += '0';
	}
	return pad + str;
};

function trimLeft(str, maxLen) {
	str = str + '';
	let trim = 0;
	while (str[trim] === '0' && (str.length - trim) > maxLen) {
		++trim;
	}
	return str.slice(trim);
};
