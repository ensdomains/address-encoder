import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "AIB";
const coinType = 55;

const p2pkhVersions = [[0x17]];
const p2shVersions = [[0x05]];

export const encodeAibAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeAibAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const aib = {
  name,
  coinType,
  encode: encodeAibAddress,
  decode: decodeAibAddress,
} satisfies Coin;
