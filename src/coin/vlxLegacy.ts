import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "vlxLegacy";
const coinType = 574;

export const encodeVlxLegacyAddress = base58UncheckedEncode;
export const decodeVlxLegacyAddress = base58UncheckedDecode;

export const vlxLegacy = {
  name,
  coinType,
  encode: encodeVlxLegacyAddress,
  decode: decodeVlxLegacyAddress,
} as const satisfies CheckedCoin;
