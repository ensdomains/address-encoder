import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "dcr";
const coinType = 42;

export const encodeDcrAddress = base58UncheckedEncode;
export const decodeDcrAddress = base58UncheckedDecode;

export const dcr = {
  name,
  coinType,
  encode: encodeDcrAddress,
  decode: decodeDcrAddress,
} as const satisfies CheckedCoin;
