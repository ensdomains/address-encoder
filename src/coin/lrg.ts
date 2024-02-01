import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "lrg";
const coinType = 568;

const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x0d])];

export const encodeLrgAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeLrgAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const lrg = {
  name,
  coinType,
  encode: encodeLrgAddress,
  decode: decodeLrgAddress,
} as const satisfies CheckedCoin;
