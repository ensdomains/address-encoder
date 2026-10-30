import { blake2b } from '@noble/hashes/blake2b'
import { utf8ToBytes } from '@noble/hashes/utils'
import { bech32m } from '@scure/base'

// Zcash Unified Addresses (ZIP 316, Revision 0) and TEX addresses (ZIP 320).
//
// Binary representation used by this library:
// - Unified Address: the Bech32m payload as it appears in the address string,
//   i.e. F4Jumble(raw encoding || 16-byte HRP padding). The padding makes the
//   bytes self-describing: F4Jumble^-1 of anything that is not a Unified
//   Address ends in the padding "u" with probability 2^-128.
// - TEX address: the 20-byte public key hash (the Bech32m payload).
//
// Spec: https://zips.z.cash/zip-0316 , https://zips.z.cash/zip-0320
// Reference code: https://github.com/zcash/librustzcash/tree/main/components/zcash_address

const F4JUMBLE_HASH_LENGTH = 64
const F4JUMBLE_MIN_LENGTH = 38
const F4JUMBLE_MAX_LENGTH = (2 ** 16 + 1) * F4JUMBLE_HASH_LENGTH
const PADDING_LENGTH = 16
const MAX_COMPACT_SIZE = 0x2000000

const TYPECODE_P2PKH = 0x00
const TYPECODE_P2SH = 0x01
const TYPECODE_SAPLING = 0x02
const TYPECODE_ORCHARD = 0x03
const METADATA_MIN = 0xc0
const METADATA_MAX = 0xfc
const MUST_UNDERSTAND_MIN = 0xe0

const receiverLengths: Record<number, number> = {
  [TYPECODE_P2PKH]: 20,
  [TYPECODE_P2SH]: 20,
  [TYPECODE_SAPLING]: 43,
  [TYPECODE_ORCHARD]: 43,
}

const personalisation = (prefix: string, tail: number[]) => {
  const result = new Uint8Array(16)
  result.set(utf8ToBytes(prefix))
  result.set(tail, prefix.length)
  return result
}

// H_i(u) = BLAKE2b-(8 * l_L)("UA_F4Jumble_H" || [i, 0, 0], u)
const xorH = (i: number, source: Uint8Array, target: Uint8Array) => {
  const hash = blake2b(source, {
    dkLen: target.length,
    personalization: personalisation('UA_F4Jumble_H', [i, 0, 0]),
  })
  for (let k = 0; k < target.length; k++) target[k] ^= hash[k]
}

// G_i(u) = first l_R bytes of the concatenation, for j = 0 .. ceil(l_R / 64) - 1, of
// BLAKE2b-512("UA_F4Jumble_G" || [i] || I2LEOSP_16(j), u)
const xorG = (i: number, source: Uint8Array, target: Uint8Array) => {
  const blocks = Math.ceil(target.length / F4JUMBLE_HASH_LENGTH)
  for (let j = 0; j < blocks; j++) {
    const hash = blake2b(source, {
      dkLen: F4JUMBLE_HASH_LENGTH,
      personalization: personalisation('UA_F4Jumble_G', [i, j & 0xff, j >> 8]),
    })
    const offset = j * F4JUMBLE_HASH_LENGTH
    const end = Math.min(F4JUMBLE_HASH_LENGTH, target.length - offset)
    for (let k = 0; k < end; k++) target[offset + k] ^= hash[k]
  }
}

const isValidF4JumbleLength = (length: number) =>
  length >= F4JUMBLE_MIN_LENGTH && length <= F4JUMBLE_MAX_LENGTH

const f4JumbleSplit = (length: number) => {
  if (!isValidF4JumbleLength(length))
    throw new Error('Invalid F4Jumble input length')
  return Math.min(F4JUMBLE_HASH_LENGTH, Math.floor(length / 2))
}

export const f4Jumble = (source: Uint8Array): Uint8Array => {
  const leftLength = f4JumbleSplit(source.length)
  const result = Uint8Array.from(source)
  const a = result.subarray(0, leftLength)
  const b = result.subarray(leftLength)
  xorG(0, a, b)
  xorH(0, b, a)
  xorG(1, a, b)
  xorH(1, b, a)
  return result
}

export const f4JumbleInverse = (source: Uint8Array): Uint8Array => {
  const leftLength = f4JumbleSplit(source.length)
  const result = Uint8Array.from(source)
  const c = result.subarray(0, leftLength)
  const d = result.subarray(leftLength)
  xorH(1, d, c)
  xorG(1, c, d)
  xorH(0, d, c)
  xorG(0, c, d)
  return result
}

const hrpPadding = (hrp: string) => {
  const padding = new Uint8Array(PADDING_LENGTH)
  padding.set(utf8ToBytes(hrp))
  return padding
}

const readCompactSize = (
  source: Uint8Array,
  position: number,
): [value: number, next: number] => {
  if (position >= source.length)
    throw new Error('Unexpected end of Unified Address data')
  const first = source[position]
  if (first < 0xfd) return [first, position + 1]
  // 0xff introduces a value >= 2^32, above the maximum of 0x2000000
  if (first === 0xff) throw new Error('Invalid compactSize in Unified Address')
  const width = first === 0xfd ? 2 : 4
  if (position + 1 + width > source.length)
    throw new Error('Unexpected end of Unified Address data')
  let value = 0
  for (let k = width - 1; k >= 0; k--)
    value = value * 256 + source[position + 1 + k]
  const minimum = first === 0xfd ? 0xfd : 0x10000
  if (value < minimum || value > MAX_COMPACT_SIZE)
    throw new Error('Invalid compactSize in Unified Address')
  return [value, position + 1 + width]
}

// Structural rules of ZIP 316 Revision 0, as enforced by librustzcash.
// Receivers are not checked as curve points (same as for Sapling addresses).
const validateRawEncoding = (raw: Uint8Array) => {
  let position = 0
  let previousTypecode = -1
  let hasP2pkh = false
  let hasP2sh = false
  let hasNonTransparent = false
  while (position < raw.length) {
    let typecode: number
    let length: number
    ;[typecode, position] = readCompactSize(raw, position)
    ;[length, position] = readCompactSize(raw, position)
    if (position + length > raw.length)
      throw new Error('Unexpected end of Unified Address data')
    position += length

    if (typecode <= previousTypecode)
      throw new Error(
        'Unified Address items must be in strictly ascending typecode order',
      )
    previousTypecode = typecode

    if (typecode >= METADATA_MIN && typecode <= METADATA_MAX) {
      if (typecode >= MUST_UNDERSTAND_MIN)
        throw new Error(
          'Unified Address contains metadata not allowed in Revision 0',
        )
      continue
    }

    const expectedLength = receiverLengths[typecode]
    if (expectedLength !== undefined && length !== expectedLength)
      throw new Error('Invalid Unified Address receiver length')
    if (typecode === TYPECODE_P2PKH) hasP2pkh = true
    else if (typecode === TYPECODE_P2SH) hasP2sh = true
    else hasNonTransparent = true
  }
  if (hasP2pkh && hasP2sh)
    throw new Error('Unified Address contains both P2PKH and P2SH receivers')
  // librustzcash treats unknown receivers as non-transparent
  if (!hasNonTransparent)
    throw new Error('Unified Address must contain a non-transparent receiver')
}

const unjumbleAndCheckPadding = (hrp: string, source: Uint8Array) => {
  if (!isValidF4JumbleLength(source.length))
    throw new Error('Invalid Unified Address length')
  const raw = f4JumbleInverse(source)
  const padding = hrpPadding(hrp)
  for (let k = 0; k < PADDING_LENGTH; k++) {
    if (raw[raw.length - PADDING_LENGTH + k] !== padding[k])
      throw new Error('Unified Address padding does not match its HRP')
  }
  return raw.subarray(0, raw.length - PADDING_LENGTH)
}

export const isZcashUnifiedPayload = (
  hrp: string,
  source: Uint8Array,
): boolean => {
  try {
    unjumbleAndCheckPadding(hrp, source)
    return true
  } catch {
    return false
  }
}

// ZIP 316 sets no length limit on the string; this is the longest one F4Jumble allows.
const unifiedLimit = (hrp: string) =>
  hrp.length + 1 + Math.ceil((F4JUMBLE_MAX_LENGTH * 8) / 5) + 6

export const createZcashUnifiedDecoder = (hrp: string) => {
  const limit = unifiedLimit(hrp)
  return (source: string): Uint8Array => {
    const { prefix, words } = bech32m.decode(
      source as `${string}1${string}`,
      limit,
    )
    if (prefix !== hrp)
      throw new Error(
        'Unexpected human-readable part in bech32m encoded address',
      )
    const decoded = new Uint8Array(bech32m.fromWords(words))
    validateRawEncoding(unjumbleAndCheckPadding(hrp, decoded))
    return decoded
  }
}

export const createZcashUnifiedEncoder = (hrp: string) => {
  const limit = unifiedLimit(hrp)
  return (source: Uint8Array): string => {
    validateRawEncoding(unjumbleAndCheckPadding(hrp, source))
    return bech32m.encode(hrp, bech32m.toWords(source), limit)
  }
}

const TEX_LENGTH = 20

export const createZcashTexDecoder = (hrp: string) => (source: string) => {
  const { prefix, words } = bech32m.decode(source as `${string}1${string}`)
  if (prefix !== hrp)
    throw new Error('Unexpected human-readable part in bech32m encoded address')
  const decoded = new Uint8Array(bech32m.fromWords(words))
  if (decoded.length !== TEX_LENGTH)
    throw new Error('Invalid TEX address length')
  return decoded
}

export const createZcashTexEncoder = (hrp: string) => (source: Uint8Array) => {
  if (source.length !== TEX_LENGTH)
    throw new Error('Invalid TEX address length')
  return bech32m.encode(hrp, bech32m.toWords(source))
}
