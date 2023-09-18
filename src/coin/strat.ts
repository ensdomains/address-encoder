import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "STRAT";
const coinType = 105;

const p2pkhVersions = [[0x3f]];
const p2shVersions = [[0x7d]];

export const encodeStratAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeStratAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const strat = {
  name,
  coinType,
  encode: encodeStratAddress,
  decode: decodeStratAddress,
} satisfies Coin;
