import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "RVN";
const coinType = 175;

const p2pkhVersions = [[0x3c]];
const p2shVersions = [[0x7a]];

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
} satisfies Coin;
