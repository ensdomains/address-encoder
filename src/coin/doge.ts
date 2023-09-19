import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58";

const name = "DOGE";
const coinType = 3;

const p2pkhVersions = [[0x1e]];
const p2shVersions = [[0x16]];

export const encodeDogeAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDogeAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const doge = {
  name,
  coinType,
  encode: encodeDogeAddress,
  decode: decodeDogeAddress,
} as const satisfies Coin;
