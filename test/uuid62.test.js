const chai = require('chai');
const should = chai.should();
var uuid62 = require('../uuid62');

describe('uuid62', () => {
	describe('v4', () => {
		it('should generate a unique id without any params', () => {
			const id = uuid62.v4();
			id.should.not.be.null;
			id.should.be.a('String');
			id.length.should.equal(22);
		});

		it('should convert id back to uuid format', function () {
			const id = uuid62.v4();
			id.should.not.be.null;
			const uuid = uuid62.decode(id);
			uuid.should.not.be.null;
			uuid.should.be.a('String');
			uuid.length.should.equal(36);

			const parts = uuid.split('-');
			parts.length.should.equal(5);
			parts.forEach((group) => {
				const num = parseInt(group, 16);
				num.should.be.at.least(0);
			});
		});

		it('should generate same encoded uuid from different formats', () => {
			const uuidA = 'de305d54-75b4-431b-adb2-eb6b9e546014';
			const uuidB = new Buffer([0xde, 0x30, 0x5d, 0x54, 0x75, 0xb4, 0x43, 0x1b, 0xad, 0xb2, 0xeb, 0x6b, 0x9e, 0x54, 0x60, 0x14]);

			const idA = uuid62.encode(uuidA);
			const idB = uuid62.encode(uuidB);

			idA.should.equal(idB);
		});

		it('decoded UUID should match original UUID', () => {
			const uuid = 'de305d54-75b4-431b-adb2-eb6b9e546014';

			const id = uuid62.encode(uuid);
			const output = uuid62.decode(id);

			output.should.equal(uuid);
		});
	});

	describe('v1', () => {
		it('should generate a unique id without any params', () => {
			const id = uuid62.v1();
			id.should.not.be.null;
			id.should.be.a('String');
			id.length.should.equal(22);
		});
	});

	describe('encode / decode', () => {
		const fixtures = {
			'0000000000000000000000': '00000000-0000-0000-0000-000000000000',
			'0cBaidlJ84Ggc5JA7IYCgv': '06ad547f-fe02-477b-9473-f7977e4d5e17',
			'4vqyd6OoARXqj9nRUNhtLQ': '941532a0-6be1-443a-a9d5-d57bdf180a52',
			'5FY8KwTsQaUJ2KzHJGetfE': 'ba86b8f0-6fdf-4944-87a0-8a491a19490e',
			'7N42dgm5tFLK9N8MT7fHC7': 'ffffffff-ffff-ffff-ffff-ffffffffffff'
		};
		let output;

		for (const key in fixtures) {
			it(`should properly encode ${fixtures[key]}`, () => {
				output = uuid62.encode(fixtures[key]);
				output.should.equal(key);
			});

			it(`should properly decode ${key}`, () => {
				output = uuid62.decode(key);
				output.should.equal(fixtures[key]);
			});
		}
	});

	describe('other bases', () => {
		it('should generate a unique id without any params in base 64', () => {
			uuid62.customBase = new uuid62.baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");
			const id = uuid62.v4();
			id.should.not.be.null;
			id.should.be.a('String');
			id.length.should.equal(22);
		});

		it('should encode and decode a uuid in base 64', () => {
			uuid62.customBase = new uuid62.baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");
			const uuid = '72be7291-fbf6-400f-87c4-455e23d01cd5';

			const id = uuid62.encode(uuid);
			id.should.not.be.null;
			id.should.equal('1OLDah-_p03Uv4hlUzQ1Pl');

			const output = uuid62.decode(id);
			output.should.not.be.null;
			output.should.equal(uuid);
		});
	});
});
