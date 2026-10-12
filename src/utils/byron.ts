import { decode, encode, Tagged } from 'cborg'
import { base58UncheckedDecode, base58UncheckedEncode } from './base58.js'
import { crc32 } from './crc32.js'

// Byron addresses are CBOR `[#6.24(address bytes), crc32(address bytes)]`
const ADDRESS_TAG = 24

export const byronEncode = (source: Uint8Array): string => {
  const checksum = crc32(source)

  const cborEncodedAddress = encode([new Tagged(ADDRESS_TAG, source), checksum])

  const address = base58UncheckedEncode(cborEncodedAddress)

  if (!address.startsWith('Ae2') && !address.startsWith('Ddz'))
    throw new Error('Unrecognised address format')

  return address
}

export const byronDecode = (source: string): Uint8Array => {
  const bytes = base58UncheckedDecode(source)

  let cborDecoded: unknown
  try {
    cborDecoded = decode(bytes, { tags: Tagged.preserve(ADDRESS_TAG) })
  } catch {
    throw new Error('Unrecognised address format')
  }

  if (!Array.isArray(cborDecoded) || cborDecoded.length !== 2)
    throw new Error('Unrecognised address format')

  const [taggedAddress, checksum] = cborDecoded
  if (
    !(taggedAddress instanceof Tagged) ||
    !(taggedAddress.value instanceof Uint8Array)
  )
    throw new Error('Unrecognised address format')

  const newChecksum = crc32(taggedAddress.value)

  if (checksum !== newChecksum) throw new Error('Unrecognised address format')

  return taggedAddress.value
}
