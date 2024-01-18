import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "srm";
const coinType = 573;

export const encodeSrmAddress = base58UncheckedEncode;
export const decodeSrmAddress = base58UncheckedDecode;

export const srm = {
  name,
  coinType,
  encode: encodeSrmAddress,
  decode: decodeSrmAddress,
} as const satisfies CheckedCoin;
