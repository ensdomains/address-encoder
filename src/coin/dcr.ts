import { Coin } from "../types";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58";

const name = "DCR";
const coinType = 42;

export const encodeDcrAddress = base58EncodeNoCheck;
export const decodeDcrAddress = base58DecodeNoCheck;

export const dcr = {
  name,
  coinType,
  encode: encodeDcrAddress,
  decode: decodeDcrAddress,
} as const satisfies Coin;
