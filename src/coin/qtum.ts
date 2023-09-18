import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "QTUM";
const coinType = 2301;

export const encodeQtumAddress = bs58Encode;
export const decodeQtumAddress = bs58Decode;

export const qtum = {
  name,
  coinType,
  encode: encodeQtumAddress,
  decode: decodeQtumAddress,
} as const satisfies Coin;
