[![npm version](https://badge.fury.io/js/uuid62.svg)](http://badge.fury.io/js/uuid62)
[![CircleCI](https://circleci.com/gh/shanehughes3/uuid62.svg?style=shield)](https://circleci.com/gh/shanehughes3/uuid62)
[![Dependency Status](https://david-dm.org/shanehughes3/uuid62.svg)](https://david-dm.org/shanehughes3/uuid62)

# uuid62
Base-62 UUID generator


## Overview

`uuid62` makes it easy to generate short base-62 (or any other base) UUIDs. ID
generation is done by [uuid](https://github.com/kelektiv/node-uuid)
which follows [RFC4122](http://www.ietf.org/rfc/rfc4122.txt). The encoded UUIDs
are alphanumeric [0-9a-zA-Z] and always have a length of 22 chars.

`uuid62` began as a fork of
[dmarcelino](https://github.com/dmarcelino/uuid-base62)'s
`uuid-base62`. It provides updated dependencies and more features above that
package. `uuid62` is designed to be a drop-in replacement for `uuid-base62`,
however, so migration should be trivial.


## Installation
```shell
npm i uuid62
```

## Usage
```javascript
const uuid62 = require('uuid62');

const uuid = uuid62.v4();
// -> 2qY9COoAhfMrsH7mCyh86T

// decode a base-62 uuid
const originalUUID = uuid62.decode(uuid);
// -> 9af099b2-6244-4fc1-b72b-1d69a24481b7

// base-62 encode an existing traditional uuid
const encoded = uuid62.encode('8fc60e7c-3b3c-48e9-a6a7-a5fe4f1fbc31');
// -> 2fNwVYePN8WqqDFvVf7XMN
```

## API

`uuid62` is essentially a wrapper around [uuid](https://www.npmjs.com/package/uuid).
All optional parameters specified in `uuid`'s API can also be provided here.
Note that any buffer that would be returned by `uuid` will be converted into a
base-62 string representation by this library.

### v1 (timestamp-based)

`uuid62.v1()`

Returns a string. See `uuid` for optional parameters to specify timestamp and
node id.

### v4 (random)

`uuid62.v4()`

Returns a string.

### v5 (namespace)

`uuid62.v5(<name>, <namespace>)`

Returns a string. Requires:
- `name` - a string or array
- `namespace` - a string or buffer representing a uuid. String representation
  may be conventional or base-62. Two pre-defined namespaces are exposed at
  `uuid62.DNS` and `uuid62.URL`.

Examples:
```javascript
let id = uuid62.v5('https://google.com', uuid62.URL);

id = uuid62.v5('google.com' uuid62.DNS);

const myNS = uuid62.v4();
id = uuid62.v5('foobar', myNS);
```

### Encoding/decoding

`uuid62.encode(<id>, <encoding>)`

Returns a string representing a base-62 id. Takes:
- `id` - a string or array representing a conventional uuid
- `encoding` - an optional string specifying the encoding of the input id.
  Defaults to hex.

If the input id is of the incorrect length, the output will be padded with `0`
on the left or trimmed from the left.

`uuid62.decode(<id>, <encoding>)`

Returns a string representing a conventional uuid, including dashes. Takes:
- `id` - a string representing a base-62 uuid
- `encoding` - an optional string specifying the encoding of the output id.
  Defaults to hex.

If the input id is of the incorrect length, it will be padded with `0` on the
left or trimmed from the left before decoding.


### Other bases

uuid62 can support other bases by assigning a new baseX charset to `customBase`:
```javascript
uuid62.customBase = new uuid62.baseX("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_");
const uuid = uuid62.v4();
// -> 31LoSI_BVeQpXtwu_-GEbL
```

## License
MIT
