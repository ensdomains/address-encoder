import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "iost";
const coinType = 291;

export const encodeIostAddress = base58UncheckedEncode;
export const decodeIostAddress = base58UncheckedDecode;

export const iost = {
  name,
  coinType,
  encode: encodeIostAddress,
  decode: decodeIostAddress,
} as const satisfies CheckedCoin;
