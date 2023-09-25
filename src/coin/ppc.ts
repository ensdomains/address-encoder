import type { Coin } from "../types.js";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58.js";

const name = "ppc";
const coinType = 6;

const p2pkhVersions = [new Uint8Array([0x37])];
const p2shVersions = [new Uint8Array([0x75])];

export const encodePpcAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodePpcAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const ppc = {
  name,
  coinType,
  encode: encodePpcAddress,
  decode: decodePpcAddress,
} as const satisfies Coin;
