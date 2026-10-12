import { keccak_256 } from '@noble/hashes/sha3'
import { bytesToHex } from '@noble/hashes/utils'
import type { CheckedCoin } from '../types.js'
import { base32Decode, base32Encode } from '../utils/base32.js'

const name = 'xem'
const coinType = 43

export const encodeXemAddress = base32Encode

export const decodeXemAddress = (source: string): Uint8Array => {
  const address = source.toUpperCase().replace(/-/g, '')

  if (address.length !== 40) throw new Error('Invalid address')

  const decoded = base32Decode(address)

  const checksum = bytesToHex(keccak_256(decoded.slice(0, 21))).slice(0, 8)

  if (checksum !== bytesToHex(decoded.slice(21)))
    throw new Error('Invalid address')

  return decoded
}

export const xem = {
  name,
  coinType,
  encode: encodeXemAddress,
  decode: decodeXemAddress,
} as const satisfies CheckedCoin
