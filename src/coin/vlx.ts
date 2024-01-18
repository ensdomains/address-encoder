import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "vlx";
const coinType = 5655640;

export const encodeVlxAddress = base58UncheckedEncode;
export const decodeVlxAddress = base58UncheckedDecode;

export const vlx = {
  name,
  coinType,
  encode: encodeVlxAddress,
  decode: decodeVlxAddress,
} as const satisfies CheckedCoin;
