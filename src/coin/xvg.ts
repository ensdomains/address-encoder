import { Coin } from "../types";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "../utils/bs58";

const name = "XVG";
const coinType = 77;

const p2pkhVersions = [[0x1e]];
const p2shVersions = [[0x21]];

export const encodeXvgAddress = createBase58WithCheckEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeXvgAddress = createBase58WithCheckDecoder(
  p2pkhVersions,
  p2shVersions
);

export const xvg = {
  name,
  coinType,
  encode: encodeXvgAddress,
  decode: decodeXvgAddress,
} as const satisfies Coin;
