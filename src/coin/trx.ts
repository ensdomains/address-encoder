import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "trx";
const coinType = 195;

export const encodeTrxAddress = base58CheckEncode;
export const decodeTrxAddress = base58CheckDecode;

export const trx = {
  name,
  coinType,
  encode: encodeTrxAddress,
  decode: decodeTrxAddress,
} as const satisfies CheckedCoin;
