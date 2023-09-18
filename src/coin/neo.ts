import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "NEO";
const coinType = 239;

export const encodeNeoAddress = bs58Encode;
export const decodeNeoAddress = bs58Decode;

export const neo = {
  name,
  coinType,
  encode: encodeNeoAddress,
  decode: decodeNeoAddress,
} satisfies Coin;
