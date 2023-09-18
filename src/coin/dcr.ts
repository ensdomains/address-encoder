import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "DCR";
const coinType = 42;

export const encodeDcrAddress = bs58EncodeNoCheck;
export const decodeDcrAddress = bs58DecodeNoCheck;

export const nmc = {
  name,
  coinType,
  encode: encodeDcrAddress,
  decode: decodeDcrAddress,
} as const satisfies Coin;
