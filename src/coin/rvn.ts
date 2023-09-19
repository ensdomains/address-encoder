import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58";

const name = "RVN";
const coinType = 175;

const p2pkhVersions = [new Uint8Array([0x3c])];
const p2shVersions = [new Uint8Array([0x7a])];

export const encodeRvnAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeRvnAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const rvn = {
  name,
  coinType,
  encode: encodeRvnAddress,
  decode: decodeRvnAddress,
} as const satisfies Coin;
