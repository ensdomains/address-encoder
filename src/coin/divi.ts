import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "DIVI";
const coinType = 301;

const p2pkhVersions = [[0x1e]];
const p2shVersions = [[0xd]];

export const encodeDiviAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDiviAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const divi = {
  name,
  coinType,
  encode: encodeDiviAddress,
  decode: decodeDiviAddress,
} satisfies Coin;
