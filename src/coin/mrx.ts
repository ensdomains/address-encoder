import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "mrx";
const coinType = 326;

export const encodeMrxAddress = base58CheckEncode;
export const decodeMrxAddress = base58CheckDecode;

export const mrx = {
  name,
  coinType,
  encode: encodeMrxAddress,
  decode: decodeMrxAddress,
} as const satisfies CheckedCoin;
