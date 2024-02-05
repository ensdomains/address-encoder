import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "nmc";
const coinType = 7;

export const encodeNmcAddress = base58CheckEncode;
export const decodeNmcAddress = base58CheckDecode;

export const nmc = {
  name,
  coinType,
  encode: encodeNmcAddress,
  decode: decodeNmcAddress,
} as const satisfies CheckedCoin;
