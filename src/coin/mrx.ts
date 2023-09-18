import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "MRX";
const coinType = 326;

export const encodeMrxAddress = bs58Encode;
export const decodeMrxAddress = bs58Decode;

export const mrx = {
  name,
  coinType,
  encode: encodeMrxAddress,
  decode: decodeMrxAddress,
} satisfies Coin;
