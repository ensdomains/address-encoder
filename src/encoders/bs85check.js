const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
const base58 = require('./base-x')(ALPHABET)
const { SHA3 } = require('sha3');


function sha256(data, resultEncoding) {
    return new SHA3(256).update(data).digest(resultEncoding);
}

const bs58checkBase = function (checksumFn) {
    // Encode a buffer as a base58-check encoded string
    function encode(payload) {
        var checksum = checksumFn(payload)

        return base58.encode(Buffer.concat([
            payload,
            checksum
        ], payload.length + 4))
    }

    function decodeRaw(buffer) {
        var payload = buffer.slice(0, -4)
        var checksum = buffer.slice(-4)
        var newChecksum = checksumFn(payload)

        if (checksum[0] ^ newChecksum[0] |
            checksum[1] ^ newChecksum[1] |
            checksum[2] ^ newChecksum[2] |
            checksum[3] ^ newChecksum[3]) return

        return payload
    }

    // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
    function decodeUnsafe(string) {
        var buffer = base58.decodeUnsafe(string)
        if (!buffer) return

        return decodeRaw(buffer)
    }

    function decode(string) {
        var buffer = base58.decode(string)
        var payload = decodeRaw(buffer, checksumFn)
        if (!payload) throw new Error('Invalid checksum')
        return payload
    }

    return {
        encode: encode,
        decode: decode,
        decodeUnsafe: decodeUnsafe
    }
}

// SHA256(SHA256(buffer))
function sha256x2(buffer) {
    return sha256(sha256(buffer))
}

module.exports = bs58checkBase(sha256x2)