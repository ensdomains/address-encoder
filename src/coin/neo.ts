import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "neo";
const coinType = 888;

export const encodeNeoAddress = base58CheckEncode;
export const decodeNeoAddress = base58CheckDecode;

export const neo = {
  name,
  coinType,
  encode: encodeNeoAddress,
  decode: decodeNeoAddress,
} as const satisfies CheckedCoin;
