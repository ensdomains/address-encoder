import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "rvn";
const coinType = 175;

const p2pkhVersions = [new Uint8Array([0x3c])];
const p2shVersions = [new Uint8Array([0x7a])];

export const encodeRvnAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeRvnAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const rvn = {
  name,
  coinType,
  encode: encodeRvnAddress,
  decode: decodeRvnAddress,
} as const satisfies CheckedCoin;
