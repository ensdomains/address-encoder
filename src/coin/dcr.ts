import type { Coin } from "../types.js";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58.js";

const name = "dcr";
const coinType = 42;

export const encodeDcrAddress = base58EncodeNoCheck;
export const decodeDcrAddress = base58DecodeNoCheck;

export const dcr = {
  name,
  coinType,
  encode: encodeDcrAddress,
  decode: decodeDcrAddress,
} as const satisfies Coin;
