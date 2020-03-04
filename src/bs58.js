'use strict'

const createHash = require('sha.js')
var base58 = require('bs58')
function sha256x2 (buffer) {
    var tmp = createHash('sha256').update(buffer).digest()
    return createHash('sha256').update(tmp).digest()
}
const bs58Check = function (checksumFn) {
    // Encode a buffer as a base58-check encoded string
    function encode (payload) {
        var checksum = checksumFn(payload)

        return base58.encode(Buffer.concat([
            payload,
            checksum
        ], payload.length + 4))
    }
    function decodeRaw (buffer) {
        var payload = buffer.slice(0, -4)
        var checksum = buffer.slice(-4)
        var newChecksum = checksumFn(payload)
        /* tslint:disable:no-bitwise */
        if (checksum[0] ^ newChecksum[0] |
            checksum[1] ^ newChecksum[1] |
            checksum[2] ^ newChecksum[2] |
            checksum[3] ^ newChecksum[3]) { return }

        return payload
    }
    // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
    function decodeUnsafe (data) {
        var buffer = base58.decodeUnsafe(data)
        if (!buffer) { return }

        return decodeRaw(buffer)
    }
    function decode (data) {
        var buffer = base58.decode(data)
        var payload = decodeRaw(buffer, checksumFn)
        if (!payload) { throw new Error('Invalid checksum') }
        return payload
    }
    return { encode: encode, decode: decode, decodeUnsafe: decodeUnsafe }
};
module.exports = bs58Check(sha256x2);
