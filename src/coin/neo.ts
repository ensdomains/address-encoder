import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

const name = "NEO";
const coinType = 239;

export const encodeNeoAddress = base58Encode;
export const decodeNeoAddress = base58Decode;

export const neo = {
  name,
  coinType,
  encode: encodeNeoAddress,
  decode: decodeNeoAddress,
} as const satisfies Coin;
