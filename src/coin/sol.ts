import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "sol";
const coinType = 501;

export const encodeSolAddress = (source: Uint8Array) => {
  if (source.length !== 32) throw new Error("Unrecognised address format");

  return base58UncheckedEncode(source);
};
export const decodeSolAddress = (source: string) => {
  const decoded = base58UncheckedDecode(source);
  if (decoded.length !== 32) throw new Error("Unrecognised address format");

  return decoded;
};

export const sol = {
  name,
  coinType,
  encode: encodeSolAddress,
  decode: decodeSolAddress,
} as const satisfies CheckedCoin;
