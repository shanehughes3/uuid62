'use strict';

const uuid = require('uuid');
const uuidv1 = require('uuid/v1');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const baseX = require('base-x');
const base62 = baseX('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
const OUTPUT_LENGTH = 22;
const UUID_LENGTH = 32;

if (typeof Buffer === 'undefined') {
	// import buffer module for use in browser - browserify and perhaps webpack
	// should do this automatically, but otherwise we'll pull it in here
	Buffer = require('buffer').Buffer;
}

class UUID62 {
	constructor() {
		this.base = base62;
		// expose underlying methods for convenience (matches uuid-base62)
		this.uuid = uuid;
		this.baseX = baseX;
		// pre-defined v5/v3 namespaces
		this.URL = '3h8Pgc0Wb7WH6HsyG77m40';
		this.DNS = '3h8PgalTIPNcNhUD4ZbIKY';
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
		const id = uuidv4.apply(this, args);
		return this.encode(id);
	}

	v5() {
		const args = Array.prototype.slice.call(arguments);
		if (typeof args[1] === 'string' && /^[0-9A-Za-z]{22}$/.test(args[1])) {
			args[1] = this.decode(args[1]);
		}
		const id = uuidv5.apply(this, args);
		return this.encode(id);
	}

	v1() {
		const args = Array.prototype.slice.call(arguments);
		if (!args[1]) {
			// make sure we use a buffer to avoid getting a uuid with dashes
			args[1] = new Buffer(16);
		}
		const id = uuidv1.apply(this, args);
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
