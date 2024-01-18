import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "kmd";
const coinType = 141;

const p2pkhVersions = [new Uint8Array([0x3c])];
const p2shVersions = [new Uint8Array([0x55])];

export const encodeKmdAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeKmdAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const kmd = {
  name,
  coinType,
  encode: encodeKmdAddress,
  decode: decodeKmdAddress,
} as const satisfies CheckedCoin;
