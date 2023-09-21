import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

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
