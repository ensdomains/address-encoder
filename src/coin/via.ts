import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/base58";

const name = "VIA";
const coinType = 14;

const p2pkhVersions = [[0x47]];
const p2shVersions = [[0x21]];

export const encodeViaAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeViaAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const via = {
  name,
  coinType,
  encode: encodeViaAddress,
  decode: decodeViaAddress,
} as const satisfies Coin;
