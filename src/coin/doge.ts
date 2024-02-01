import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "doge";
const coinType = 3;

const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x16])];

export const encodeDogeAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDogeAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const doge = {
  name,
  coinType,
  encode: encodeDogeAddress,
  decode: decodeDogeAddress,
} as const satisfies CheckedCoin;
