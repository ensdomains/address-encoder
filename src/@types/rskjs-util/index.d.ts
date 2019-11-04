declare module 'rskjs-util' {

  /**
   * Generates checksummed address.
   * @param {string} address
   * @param {number} chainId where checksummed address should be valid.
   * @returns {string} address with checksum applied.
   */
  export function toChecksumAddress(address: string, chainId: number | null): string;


  /**
   * Removes prefix from address if exists.
   * @param {string} address
   * @returns {string} address without prefix
   */
  export function stripHexPrefix(address: string): string;

  /**
   * Validates checksummed address.
   * @param {string} address
   * @param {number} chainId where checksummed address should be valid.
   * @returns {boolean} if the address is valid on the specified chain.
   */
  export function isValidChecksumAddress(address: string, chainId: number | null): boolean;

  /**
   * Validates address.
   * @param {string} address
   * @returns {boolean} if the address is valid.
   */
  export function isValidAddress(address: string): boolean


  /**
   * Generates keccak sha256
   * @param {string} a keccak input
   * @returns {string} keccak sha256
   */
  export function keccak(a: string): string
}
