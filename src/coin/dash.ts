import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "dash";
const coinType = 5;

const p2pkhVersions = [new Uint8Array([0x4c])];
const p2shVersions = [new Uint8Array([0x10])];

export const encodeDashAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDashAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const dash = {
  name,
  coinType,
  encode: encodeDashAddress,
  decode: decodeDashAddress,
} as const satisfies CheckedCoin;
