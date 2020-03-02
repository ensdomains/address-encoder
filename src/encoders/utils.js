// https://github.com/christsim/multicoin-address-validator/blob/master/src/crypto/utils.js
// christsim multicoin - address - validator

const createKeccakHash = require('./keccak256')

const base32  = require('base32.js');

function numberToHex(number) {
    var hex = Math.round(number).toString(16)
    if (hex.length === 1) {
        hex = '0' + hex
    }
    return hex
}


/**
 * Generates keccak sha256
 * @param {string} keccak input
 * @returns {string} keccak sha256 
 */
function keccak(a) {
    return createKeccakHash('keccak256').update(a).digest()
}

module.exports = {
    toHex: function (arrayOfBytes) {
        var hex = '';
        for (var i = 0; i < arrayOfBytes.length; i++) {
            hex += numberToHex(arrayOfBytes[i]);
        }
        return hex;
    },
    keccak256Checksum: function (payload) {
        return keccak256(payload).toString().substr(0, 8);
    },
    base32: base32
}

// keccak256Checksum base32 toHex