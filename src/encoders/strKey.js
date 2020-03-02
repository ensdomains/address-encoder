/* eslint-disable no-bitwise */

import base32 from 'base32.js';

//taken from crc package
const createBuffer =
    Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow
        ? Buffer.from
        : // support for Node < 5.10
        val => new Buffer(val);

function defineCrc (model, calc) {
    const fn = (buf, previous) => calc(buf, previous) >>> 0;
    fn.signed = calc;
    fn.unsigned = fn;
    fn.model = model;
    return fn;
}

const crc16xmodem = defineCrc('xmodem', function (buf, previous) {
    if (!Buffer.isBuffer(buf)) buf = createBuffer(buf);

    let crc = typeof previous !== 'undefined' ? ~~previous : 0x0;

    for (let index = 0; index < buf.length; index++) {
        const byte = buf[index];
        let code = (crc >>> 8) & 0xff;

        code ^= byte & 0xff;
        code ^= code >>> 4;
        crc = (crc << 8) & 0xffff;
        crc ^= code;
        code = (code << 5) & 0xffff;
        crc ^= code;
        code = (code << 7) & 0xffff;
        crc ^= code;
    }

    return crc;
});


//TAKEN from lodash

function isUndefined(value) {
    return value === undefined
}


function isNull(obj) {
    return obj === null;
}            

function isString(value) {
    const type = typeof value
    return type === 'string' || (type === 'object' && value != null && !Array.isArray(value) && getTag(value) == '[object String]')
}


function verifyChecksum(expected, actual) {
    if (expected.length !== actual.length) {
        return false;
    }

    if (expected.length === 0) {
        return true;
    }

    for (let i = 0; i < expected.length; i += 1) {
        if (expected[i] !== actual[i]) {
            return false;
        }
    }

    return true;
}

const versionBytes = {
    ed25519PublicKey: 6 << 3, // G
    ed25519SecretSeed: 18 << 3, // S
    preAuthTx: 19 << 3, // T
    sha256Hash: 23 << 3 // X
};

/**
 * StrKey is a helper class that allows encoding and decoding strkey.
 */
export class StrKey {
    /**
     * Encodes data to strkey ed25519 public key.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeEd25519PublicKey(data) {
        return encodeCheck('ed25519PublicKey', data);
    }

    /**
     * Decodes strkey ed25519 public key to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */
    static decodeEd25519PublicKey(data) {
        return decodeCheck('ed25519PublicKey', data);
    }

    /**
     * Returns true if the given Stellar public key is a valid ed25519 public key.
     * @param {string} publicKey public key to check
     * @returns {boolean}
     */
    static isValidEd25519PublicKey(publicKey) {
        return isValid('ed25519PublicKey', publicKey);
    }

    /**
     * Encodes data to strkey ed25519 seed.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeEd25519SecretSeed(data) {
        return encodeCheck('ed25519SecretSeed', data);
    }

    /**
     * Decodes strkey ed25519 seed to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */
    static decodeEd25519SecretSeed(data) {
        return decodeCheck('ed25519SecretSeed', data);
    }

    /**
     * Returns true if the given Stellar secret key is a valid ed25519 secret seed.
     * @param {string} seed seed to check
     * @returns {boolean}
     */
    static isValidEd25519SecretSeed(seed) {
        return isValid('ed25519SecretSeed', seed);
    }

    /**
     * Encodes data to strkey preAuthTx.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodePreAuthTx(data) {
        return encodeCheck('preAuthTx', data);
    }

    /**
     * Decodes strkey PreAuthTx to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */
    static decodePreAuthTx(data) {
        return decodeCheck('preAuthTx', data);
    }

    /**
     * Encodes data to strkey sha256 hash.
     * @param {Buffer} data data to encode
     * @returns {string}
     */
    static encodeSha256Hash(data) {
        return encodeCheck('sha256Hash', data);
    }

    /**
     * Decodes strkey sha256 hash to raw data.
     * @param {string} data data to decode
     * @returns {Buffer}
     */
    static decodeSha256Hash(data) {
        return decodeCheck('sha256Hash', data);
    }
}

function isValid(versionByteName, encoded) {
    if (encoded && encoded.length !== 56) {
        return false;
    }

    try {
        const decoded = decodeCheck(versionByteName, encoded);
        if (decoded.length !== 32) {
            return false;
        }
    } catch (err) {
        return false;
    }
    return true;
}

export function decodeCheck(versionByteName, encoded) {
    if (!isString(encoded)) {
        throw new TypeError('encoded argument must be of type String');
    }

    const decoded = base32.decode(encoded);
    const versionByte = decoded[0];
    const payload = decoded.slice(0, -2);
    const data = payload.slice(1);
    const checksum = decoded.slice(-2);

    if (encoded !== base32.encode(decoded)) {
        throw new Error('invalid encoded string');
    }

    const expectedVersion = versionBytes[versionByteName];

    if (isUndefined(expectedVersion)) {
        throw new Error(
            `${versionByteName} is not a valid version byte name.  expected one of "accountId" or "seed"`
        );
    }

    if (versionByte !== expectedVersion) {
        throw new Error(
            `invalid version byte. expected ${expectedVersion}, got ${versionByte}`
        );
    }

    const expectedChecksum = calculateChecksum(payload);

    if (!verifyChecksum(expectedChecksum, checksum)) {
        throw new Error(`invalid checksum`);
    }

    return Buffer.from(data);
}

export function encodeCheck(versionByteName, data) {
    if (isNull(data) || isUndefined(data)) {
        throw new Error('cannot encode null data');
    }

    const versionByte = versionBytes[versionByteName];

    if (isUndefined(versionByte)) {
        throw new Error(
            `${versionByteName} is not a valid version byte name.  expected one of "ed25519PublicKey", "ed25519SecretSeed", "preAuthTx", "sha256Hash"`
        );
    }

    data = Buffer.from(data);
    const versionBuffer = Buffer.from([versionByte]);
    const payload = Buffer.concat([versionBuffer, data]);
    const checksum = calculateChecksum(payload);
    const unencoded = Buffer.concat([payload, checksum]);

    return base32.encode(unencoded);
}

function calculateChecksum(payload) {
    // This code calculates CRC16-XModem checksum of payload
    // and returns it as Buffer in little-endian order.
    const checksum = Buffer.alloc(2);
    checksum.writeUInt16LE(crc.crc16xmodem(payload), 0);
    return checksum;
}