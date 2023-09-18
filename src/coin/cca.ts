import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "CCA";
const coinType = 489;

const p2pkhVersions = [[0x0b]];
const p2shVersions = [[0x05]];

export const encodeCcaAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeCcaAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const cca = {
  name,
  coinType,
  encode: encodeCcaAddress,
  decode: decodeCcaAddress,
} satisfies Coin;
