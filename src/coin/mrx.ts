import type { Coin } from "../types.js";
import { base58Decode, base58Encode } from "../utils/base58.js";

const name = "mrx";
const coinType = 326;

export const encodeMrxAddress = base58Encode;
export const decodeMrxAddress = base58Decode;

export const mrx = {
  name,
  coinType,
  encode: encodeMrxAddress,
  decode: decodeMrxAddress,
} as const satisfies Coin;
