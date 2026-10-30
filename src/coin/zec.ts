import type { CheckedCoin } from '../types.js'
import { createBase58VersionedEncoder } from '../utils/base58.js'
import { createBech32Encoder } from '../utils/bech32.js'
import { createZcashDecoder } from '../utils/zcash.js'
import {
  createZcashTexDecoder,
  createZcashTexEncoder,
  createZcashUnifiedDecoder,
  createZcashUnifiedEncoder,
  isZcashUnifiedPayload,
} from '../utils/zcashUnified.js'

const name = 'zec'
const coinType = 133

const hrp = 'zs'
const unifiedHrp = 'u'
const texHrp = 'tex'
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])]
const p2shVersions = [new Uint8Array([0x1c, 0xbd])]

const saplingLength = 43
const texLength = 20

const encodeTransparent = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0],
)
const encodeSapling = createBech32Encoder(hrp)
const decodeTransparentOrSapling = createZcashDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
})
const encodeUnified = createZcashUnifiedEncoder(unifiedHrp)
const decodeUnified = createZcashUnifiedDecoder(unifiedHrp)
const encodeTex = createZcashTexEncoder(texHrp)
const decodeTex = createZcashTexDecoder(texHrp)

// Binary forms are told apart by length and, for Unified Addresses, by the
// HRP padding inside the F4Jumble'd payload (see utils/zcashUnified.ts):
// P2PKH script 25 bytes, P2SH script 23, TEX 20, Sapling 43, Unified >= 38.
export const encodeZecAddress = (source: Uint8Array): string => {
  if (source.length === texLength) return encodeTex(source)
  if (isZcashUnifiedPayload(unifiedHrp, source)) return encodeUnified(source)
  if (source.length === saplingLength) return encodeSapling(source)
  return encodeTransparent(source)
}
export const decodeZecAddress = (source: string): Uint8Array => {
  const lowered = source.toLowerCase()
  if (lowered.startsWith(`${unifiedHrp}1`)) return decodeUnified(source)
  if (lowered.startsWith(`${texHrp}1`)) return decodeTex(source)
  const decoded = decodeTransparentOrSapling(source)
  if (lowered.startsWith(hrp) && decoded.length !== saplingLength)
    throw new Error('Invalid Sapling address length')
  return decoded
}

export const zec = {
  name,
  coinType,
  encode: encodeZecAddress,
  decode: decodeZecAddress,
} as const satisfies CheckedCoin
