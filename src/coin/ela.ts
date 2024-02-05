import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "ela";
const coinType = 2305;

export const encodeElaAddress = base58UncheckedEncode;
export const decodeElaAddress = base58UncheckedDecode;

export const ela = {
  name,
  coinType,
  encode: encodeElaAddress,
  decode: decodeElaAddress,
} as const satisfies CheckedCoin;
