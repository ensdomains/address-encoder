import type { Coin } from "../types.js";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58.js";

const name = "wicc";
const coinType = 99999;

const p2pkhVersions = [new Uint8Array([0x49])];
const p2shVersions = [new Uint8Array([0x33])];

export const encodeWiccAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeWiccAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const wicc = {
  name,
  coinType,
  encode: encodeWiccAddress,
  decode: decodeWiccAddress,
} as const satisfies Coin;
