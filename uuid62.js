'use strict';

const uuid = require('uuid');
const baseX = require('base-x');
const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const OUTPUT_LENGTH = 22;
const UUID_LENGTH = 32;

class UUID62 {
	constructor() {
		this.base = base62;
		// expose underlying methods for convenience
		this.uuid = uuid;
		this.baseX = baseX;
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
			// make sure we use a buffer to avoid getting a uuid with dashes
			args[1] = new Buffer(16);
		}
		const id = uuid.v4.apply(this, args);
		return this.encode(id);
	}

	v1() {
		const args = Array.prototype.slice.call(arguments);
		if (!args[1]) {
			// make sure we use a buffer to avoid getting a uuid with dashes
			args[1] = new Buffer(16);
		}
		const id = uuid.v1.apply(this, args);
		return this.encode(id);
	}

	encode(input, encoding) {
		encoding = encoding || 'hex';
		if (typeof input === 'string') {
			// remove the dashes to save some space
			input = new Buffer(input.replace(/-/g, ''), encoding);
		}
		return ensureLength(this.base.encode(input), OUTPUT_LENGTH);
	}

	decode(input, encoding) {
		encoding = encoding || 'hex';
		const res = ensureLength(
			new Buffer(this.base.decode(input)).toString(encoding),
			UUID_LENGTH
		);
		// insert dashes on return
		return `${res.slice(0, 8)}-${res.slice(8, 12)}-${res.slice(12, 16)}-${res.slice(16, 20)}-${res.slice(20)}`;
	}
}

function ensureLength(input, targetLength) {
	input = input.toString();
	return `${'0'.repeat(32)}${input}`.slice(-targetLength);
}

module.exports = new UUID62();
