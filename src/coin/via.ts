import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "via";
const coinType = 14;

const p2pkhVersions = [new Uint8Array([0x47])];
const p2shVersions = [new Uint8Array([0x21])];

export const encodeViaAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeViaAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const via = {
  name,
  coinType,
  encode: encodeViaAddress,
  decode: decodeViaAddress,
} as const satisfies CheckedCoin;
