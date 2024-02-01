import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "hnt";
const coinType = 904;

export const encodeHntAddress = (source: Uint8Array): string => {
  const sourceWithVersion = concatBytes(new Uint8Array([0x00]), source);
  return base58CheckEncode(sourceWithVersion);
};
export const decodeHntAddress = (source: string): Uint8Array => {
  const decoded = base58CheckDecode(source);

  const version = decoded[0];
  if (version !== 0) throw new Error("Unrecognised address format");

  return decoded.slice(1);
};

export const hnt = {
  name,
  coinType,
  encode: encodeHntAddress,
  decode: decodeHntAddress,
} as const satisfies CheckedCoin;
