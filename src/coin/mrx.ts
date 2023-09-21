import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

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
