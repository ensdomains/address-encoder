import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "rdd";
const coinType = 4;

const p2pkhVersions = [new Uint8Array([0x3d])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeRddAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeRddAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const rdd = {
  name,
  coinType,
  encode: encodeRddAddress,
  decode: decodeRddAddress,
} as const satisfies CheckedCoin;
