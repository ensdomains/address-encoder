import { bytesToHex, hexToBytes } from '@noble/hashes/utils'
import type { CheckedCoin } from '../types.js'
import { validateFlowAddress } from '../utils/flow.js'

const name = 'flow'
const coinType = 539

const addressLength = 8

export const encodeFlowAddress = (source: Uint8Array): string => {
  const bytes = new Uint8Array(addressLength)
  if (source.length > addressLength) {
    bytes.set(source.slice(source.length - addressLength))
  } else {
    bytes.set(source, addressLength - source.length)
  }

  return `0x${bytesToHex(bytes)}`.toLowerCase()
}
export const decodeFlowAddress = (source: string): Uint8Array => {
  if (!validateFlowAddress(BigInt(source)))
    throw new Error('Unrecognised address format')
  return hexToBytes(source.startsWith('0x') ? source.slice(2) : source)
}

export const flow = {
  name,
  coinType,
  encode: encodeFlowAddress,
  decode: decodeFlowAddress,
} as const satisfies CheckedCoin
