import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "sero";
const coinType = 569;

export const encodeSeroAddress = base58UncheckedEncode;
export const decodeSeroAddress = (source: string): Uint8Array => {
  const decoded = base58UncheckedDecode(source);
  if (decoded.length !== 96) throw new Error("Unrecognised address format");
  return decoded;
};

export const sero = {
  name,
  coinType,
  encode: encodeSeroAddress,
  decode: decodeSeroAddress,
} as const satisfies CheckedCoin;
