var cryptoUtils = require('./utils');

// NEM - sdk
// https://github.com/QuantumMechanics/NEM-sdk/blob/master/src/utils/convert.js

const _hexEncodeArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

/**
* Convert an Uint8Array to hex
*
* @param {Uint8Array} ua - An Uint8Array
*
* @return {string}
*/
let ua2hex = function (ua) {
    let s = '';
    for (let i = 0; i < ua.length; i++) {
        let code = ua[i];
        s += _hexEncodeArray[code >>> 4];
        s += _hexEncodeArray[code & 0x0F];
    }
    return s;
};


/**
* Convert hex to string
*
* @param {string} hexx - An hex string
*
* @return {string}
*/
let hex2a = function (hexx) {
    let hex = hexx.toString();
    let str = '';
    for (let i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
};

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

/**
* Encode a string to base32
*
* @param {string} s - A string
*
* @return {Uint8Array} - The encoded string
*/
let b32encode = function (s) {
    let parts = [];
    let quanta = Math.floor((s.length / 5));
    let leftover = s.length % 5;

    if (leftover != 0) {
        for (let i = 0; i < (5 - leftover); i++) {
            s += '\x00';
        }
        quanta += 1;
    }

    for (let i = 0; i < quanta; i++) {
        parts.push(alphabet.charAt(s.charCodeAt(i * 5) >> 3));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5) & 0x07) << 2) | (s.charCodeAt(i * 5 + 1) >> 6)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 1) & 0x3F) >> 1)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 1) & 0x01) << 4) | (s.charCodeAt(i * 5 + 2) >> 4)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 2) & 0x0F) << 1) | (s.charCodeAt(i * 5 + 3) >> 7)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 3) & 0x7F) >> 2)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 3) & 0x03) << 3) | (s.charCodeAt(i * 5 + 4) >> 5)));
        parts.push(alphabet.charAt(((s.charCodeAt(i * 5 + 4) & 0x1F))));
    }

    let replace = 0;
    if (leftover == 1) replace = 6;
    else if (leftover == 2) replace = 4;
    else if (leftover == 3) replace = 3;
    else if (leftover == 4) replace = 1;

    for (let i = 0; i < replace; i++) parts.pop();
    for (let i = 0; i < replace; i++) parts.push("=");

    return parts.join("");
}


let b32decode = function (s) {
    let r = new ArrayBuffer(s.length * 5 / 8);
    let b = new Uint8Array(r);
    for (let j = 0; j < s.length / 8; j++) {
        let v = [0, 0, 0, 0, 0, 0, 0, 0];
        for (let i = 0; i < 8; ++i) {
            v[i] = alphabet.indexOf(s[j * 8 + i]);
        }
        let i = 0;
        b[j * 5 + 0] = (v[i + 0] << 3) | (v[i + 1] >> 2);
        b[j * 5 + 1] = ((v[i + 1] & 0x3) << 6) | (v[i + 2] << 1) | (v[i + 3] >> 4);
        b[j * 5 + 2] = ((v[i + 3] & 0xf) << 4) | (v[i + 4] >> 1);
        b[j * 5 + 3] = ((v[i + 4] & 0x1) << 7) | (v[i + 5] << 2) | (v[i + 6] >> 3);
        b[j * 5 + 4] = ((v[i + 6] & 0x7) << 5) | (v[i + 7]);
    }
    return b;
}


// https://github.com/christsim/multicoin-address-validator/blob/master/src/nem_validator.js

/**
* Check if an address is valid
*
* @param {string} _address - An address
*
* @return {boolean} - True if address is valid, false otherwise
*/
var isValid = function (_address) {
    var address = _address.toString().toUpperCase().replace(/-/g, '');
    if (!address || address.length !== 40) {
        return false;
    }
    var decoded = cryptoUtils.toHex(cryptoUtils.base32.b32decode(address));
    var stepThreeChecksum = cryptoUtils.keccak256Checksum(Buffer.from(decoded.slice(0, 42), 'hex'));

    return stepThreeChecksum === decoded.slice(42);
};


module.exports = {
    b32encode,
    b32decode,
    isValid,
    ua2hex,
    hex2a
}