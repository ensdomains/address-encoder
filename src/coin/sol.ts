import type { Coin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "sol";
const coinType = 501;

export const encodeSolAddress = base58UncheckedEncode;
export const decodeSolAddress = base58UncheckedDecode;

export const sol = {
  name,
  coinType,
  encode: encodeSolAddress,
  decode: decodeSolAddress,
} as const satisfies Coin;
