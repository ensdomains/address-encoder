import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "KMD";
const coinType = 141;

const p2pkhVersions = [[0x3c]];
const p2shVersions = [[0x55]];

export const encodeKmdAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeKmdAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const kmd = {
  name,
  coinType,
  encode: encodeKmdAddress,
  decode: decodeKmdAddress,
} satisfies Coin;
