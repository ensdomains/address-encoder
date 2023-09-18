import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "DASH";
const coinType = 5;

const p2pkhVersions = [[0x4c]];
const p2shVersions = [[0x10]];

export const encodeDashAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDashAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const dash = {
  name,
  coinType,
  encode: encodeDashAddress,
  decode: decodeDashAddress,
} as const satisfies Coin;
