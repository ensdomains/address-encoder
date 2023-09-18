import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "FIRO";
const coinType = 136;

const p2pkhVersions = [[0x52]];
const p2shVersions = [[0x07]];

export const encodeFiroAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeFiroAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const firo = {
  name,
  coinType,
  encode: encodeFiroAddress,
  decode: decodeFiroAddress,
} satisfies Coin;
