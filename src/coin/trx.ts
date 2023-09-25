import type { Coin } from "../types.js";
import { base58Decode, base58Encode } from "../utils/base58.js";

const name = "trx";
const coinType = 195;

export const encodeTrxAddress = base58Encode;
export const decodeTrxAddress = base58Decode;

export const trx = {
  name,
  coinType,
  encode: encodeTrxAddress,
  decode: decodeTrxAddress,
} as const satisfies Coin;
