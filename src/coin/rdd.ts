import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58";

const name = "RDD";
const coinType = 4;

const p2pkhVersions = [new Uint8Array([0x3d])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeRddAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeRddAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const rdd = {
  name,
  coinType,
  encode: encodeRddAddress,
  decode: decodeRddAddress,
} as const satisfies Coin;
