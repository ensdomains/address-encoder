const createKeccakHash = require('./keccak256')

/**
 * Validates checksummed address.
 * @param {string} address
 * @param {number} chainId where checksummed address should be valid.
 * @returns {bool} if the address is valid on the specified chain.
 */
function isValidChecksumAddress(address, chainId) {
    return isValidAddress(address) && (toChecksumAddress(address, chainId) === address)
}


/**
 * Validates address.
 * @param {string} address
 * @returns {bool} if the address is valid.
 */
function isValidAddress(address) {
    return /^0x[0-9a-fA-F]{40}$/.test(address)
}


/**
 * Generates checksummed address.
 * @param {string} address
 * @param {number} chain where checksummed address should be valid.
 * @returns {string} address with checksum applied.
 */
function toChecksumAddress(address, chainId = null) {
    if (typeof address !== 'string') {
        throw new Error("stripHexPrefix param must be type 'string', is currently type " + (typeof address) + ".");
    }

    const strip_address = stripHexPrefix(address).toLowerCase()
    const prefix = chainId != null ? (chainId.toString() + '0x') : ''
    const keccak_hash = keccak(prefix + strip_address).toString('hex')
    let output = '0x'

    for (let i = 0; i < strip_address.length; i++)
        output += parseInt(keccak_hash[i], 16) >= 8 ?
            strip_address[i].toUpperCase() :
            strip_address[i]

    return output
}

/**
 * Removes prefix from address if exists.
 * @param {string} address
 * @returns {string} address without prefix
 */
function stripHexPrefix(str) {
    return str.slice(0, 2) === '0x' ? str.slice(2) : str
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
    isValidChecksumAddress,
    isValidAddress,
    toChecksumAddress,
    stripHexPrefix,
    keccak
}