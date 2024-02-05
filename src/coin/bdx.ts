import type { CheckedCoin } from "../types.js";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr.js";

const name = "bdx";
const coinType = 570;

export const encodeBdxAddress = encodeXmrAddress;
export const decodeBdxAddress = decodeXmrAddress;

export const bdx = {
  name,
  coinType,
  encode: encodeBdxAddress,
  decode: decodeBdxAddress,
} as const satisfies CheckedCoin;
