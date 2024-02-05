import { equalBytes } from "@noble/curves/abstract/utils";
import { blake2b } from "@noble/hashes/blake2b";
import { keccak_256 } from "@noble/hashes/sha3";
import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "vsys";
const coinType = 360;

const vsysChecksum = (source: Uint8Array): boolean => {
  if (source[0] !== 5 || source[1] !== 77 /* M */ || source.length !== 26)
    return false;

  const checksum = source.slice(-4);
  const newChecksum = keccak_256(
    blake2b(source.slice(0, -4), { dkLen: 32 })
  ).slice(0, 4);
  if (!equalBytes(checksum, newChecksum)) return false;
  return true;
};

export const encodeVsysAddress = (source: Uint8Array): string => {
  if (!vsysChecksum(source)) throw new Error("Unrecognised address format");
  return base58UncheckedEncode(source);
};
export const decodeVsysAddress = (source: string): Uint8Array => {
  const encoded = source.startsWith("address:") ? source.slice(8) : source;
  if (encoded.length > 36) throw new Error("Unrecognised address format");

  const decoded = base58UncheckedDecode(encoded);
  if (!vsysChecksum(decoded)) throw new Error("Unrecognised address format");

  return decoded;
};

export const vsys = {
  name,
  coinType,
  encode: encodeVsysAddress,
  decode: decodeVsysAddress,
} as const satisfies CheckedCoin;
