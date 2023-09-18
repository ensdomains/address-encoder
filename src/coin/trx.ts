import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "TRX";
const coinType = 195;

export const encodeTrxAddress = bs58Encode;
export const decodeTrxAddress = bs58Decode;

export const trx = {
  name,
  coinType,
  encode: encodeTrxAddress,
  decode: decodeTrxAddress,
} satisfies Coin;
