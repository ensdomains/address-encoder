import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "BPS";
const coinType = 576;

const p2pkhVersions = [[0x00]];
const p2shVersions = [[0x05]];

export const encodeBpsAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeBpsAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const bps = {
  name,
  coinType,
  encode: encodeBpsAddress,
  decode: decodeBpsAddress,
} satisfies Coin;
