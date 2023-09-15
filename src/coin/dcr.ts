import { Coin } from "../types";
import { b58DecodeNoCheck, b58EncodeNoCheck } from "../utils/bs58";

const name = "DCR";
const coinType = 42;

export const encodeDcrAddress = b58EncodeNoCheck;
export const decodeDcrAddress = b58DecodeNoCheck;

export const nmc = {
  name,
  coinType,
  encode: encodeDcrAddress,
  decode: decodeDcrAddress,
} satisfies Coin;
