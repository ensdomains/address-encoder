import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "ppc";
const coinType = 6;

const p2pkhVersions = [new Uint8Array([0x37])];
const p2shVersions = [new Uint8Array([0x75])];

export const encodePpcAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodePpcAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const ppc = {
  name,
  coinType,
  encode: encodePpcAddress,
  decode: decodePpcAddress,
} as const satisfies CheckedCoin;
