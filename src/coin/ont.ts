import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "ont";
const coinType = 1024;

export const encodeOntAddress = (source: Uint8Array): string => {
  const sourceWithVersion = concatBytes(new Uint8Array([0x17]), source);
  return base58CheckEncode(sourceWithVersion);
};
export const decodeOntAddress = (source: string): Uint8Array => {
  const decoded = base58CheckDecode(source);

  const version = decoded[0];
  if (version !== 0x17) throw new Error("Unrecognised address format");

  return decoded.slice(1);
};

export const ont = {
  name,
  coinType,
  encode: encodeOntAddress,
  decode: decodeOntAddress,
} as const satisfies CheckedCoin;
