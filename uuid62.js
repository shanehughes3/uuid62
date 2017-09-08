'use strict';

const uuid = require('uuid');
const baseX = require('base-x');
const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')
const OUTPUT_LENGTH = 22;
const UUID_LENGTH = 32;

// expose node-uuid and baseX for convenience
// exports.uuid = uuid;
// exports.baseX = baseX;
// exports.customBase = base62;
// exports.length = OUTPUT_LENGTH;
// exports.uuidLength = UUID_LENGTH;
// exports.v4 = v4;
// exports.v1 = v1;
// exports.encode = encode;
// exports.decode = decode;

class UUID62 {
	constructor() {
		this.base = base62;
	}

	get uuid() {
		return uuid;
	}

	get baseX() {
		return baseX;
	}

	get customBase() {
		return this.base;
	}

	set customBase(base) {
		this.base = base;
	}

	get length() {
		return OUTPUT_LENGTH;
	}

	get uuidLength() {
		return UUID_LENGTH;
	}

	v4() {
		const args = Array.prototype.slice.call(arguments);

		if (!args[1]) {
			// make sure we use a buffer to avoid getting an uuid with dashes
			args[1] = new Buffer(16);
		}

		const id = uuid.v4.apply(this, args);
		return this.encode(id);
	}


	v1() {
		const args = Array.prototype.slice.call(arguments);

		if (!args[1]) {
			// make sure we use a buffer to avoid getting an uuid with dashes
			args[1] = new Buffer(16);
		}

		const id = uuid.v1.apply(this, args);
		return this.encode(id);
	}


	encode(input, encoding) {
		encoding = encoding || 'hex';
		// console.log(input);

		if (typeof input === 'string') {
			// remove the dashes to save some space
			input = new Buffer(input.replace(/-/g, ''), encoding);
		}
		// console.log(input);
		return ensureLength(this.base.encode(input), OUTPUT_LENGTH);
	}

	decode(b62Str, encoding) {
		encoding = encoding || 'hex';
		const res = ensureLength(new Buffer(this.base.decode(b62Str)).toString(encoding), UUID_LENGTH);

		// re-add the dashes so the result looks like an uuid
		const resArray = res.split('');
		[8, 13, 18, 23].forEach((idx) => {
			resArray.splice(idx, 0, '-');
		});
		return resArray.join('');
	}
}

function ensureLength(str, maxLen) {
	str = str + '';
	if (str.length < maxLen) {
		return padLeft(str, maxLen);
	}
	else if (str.length > maxLen) {
		return trimLeft(str, maxLen);
	}
	return str;
}


function padLeft(str, padding) {
	str = str + '';
	let pad = '';
	for (let i = str.length; i < padding; ++i) {
		pad += '0';
	}
	return pad + str;
}

function trimLeft(str, maxLen) {
	str = str + '';
	let trim = 0;
	while (str[trim] === '0' && (str.length - trim) > maxLen) {
		++trim;
	}
	return str.slice(trim);
}

module.exports = new UUID62();
