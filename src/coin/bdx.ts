import { Coin } from "../types";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr";

const name = "BDX";
const coinType = 570;

export const encodeBdxAddress = encodeXmrAddress;
export const decodeBdxAddress = decodeXmrAddress;

export const bdx = {
  name,
  coinType,
  encode: encodeBdxAddress,
  decode: decodeBdxAddress,
} as const satisfies Coin;
