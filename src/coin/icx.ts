import { bytesToHex, concatBytes, hexToBytes } from '@noble/hashes/utils'
import type { CheckedCoin } from '../types.js'

const name = 'icx'
const coinType = 74

export const encodeIcxAddress = (source: Uint8Array): string => {
  if (source.length !== 21) throw new Error('Invalid address length')

  const type = source[0]
  if (type === 0x00) return `hx${bytesToHex(source.slice(1))}`
  if (type === 0x01) return `cx${bytesToHex(source.slice(1))}`
  throw new Error('Invalid address type')
}
export const decodeIcxAddress = (source: string): Uint8Array => {
  const prefix = source.slice(0, 2)
  const body = source.slice(2)
  if (prefix === 'hx')
    return concatBytes(new Uint8Array([0x00]), hexToBytes(body))
  if (prefix === 'cx')
    return concatBytes(new Uint8Array([0x01]), hexToBytes(body))
  throw new Error('Invalid address prefix')
}

export const icx = {
  name,
  coinType,
  encode: encodeIcxAddress,
  decode: decodeIcxAddress,
} as const satisfies CheckedCoin
