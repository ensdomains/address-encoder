import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "NMC";
const coinType = 7;

export const encodeNmcAddress = bs58Encode;
export const decodeNmcAddress = bs58Decode;

export const nmc = {
  name,
  coinType,
  encode: encodeNmcAddress,
  decode: decodeNmcAddress,
} satisfies Coin;
