import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "qtum";
const coinType = 2301;

export const encodeQtumAddress = base58CheckEncode;
export const decodeQtumAddress = base58CheckDecode;

export const qtum = {
  name,
  coinType,
  encode: encodeQtumAddress,
  decode: decodeQtumAddress,
} as const satisfies CheckedCoin;
