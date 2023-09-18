import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "LRG";
const coinType = 568;

const p2pkhVersions = [[0x1e]];
const p2shVersions = [[0x0d]];

export const encodeLrgAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeLrgAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const lrg = {
  name,
  coinType,
  encode: encodeLrgAddress,
  decode: decodeLrgAddress,
} satisfies Coin;
