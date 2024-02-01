import { sha3_256 } from "@noble/hashes/sha3";
import { utils } from "@scure/base";
import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "nas";
const coinType = 2718;

const nasChecksum = utils.checksum(4, sha3_256);

export const encodeNasAddress = (source: Uint8Array): string => {
  const checksummed = nasChecksum.encode(source);
  return base58UncheckedEncode(checksummed);
};
export const decodeNasAddress = (source: string): Uint8Array => {
  const decoded = base58UncheckedDecode(source);

  if (
    decoded.length !== 26 ||
    decoded[0] !== 25 ||
    (decoded[1] !== 87 && decoded[1] !== 88)
  )
    throw new Error("Unrecognised address format");

  return nasChecksum.decode(decoded);
};

export const nas = {
  name,
  coinType,
  encode: encodeNasAddress,
  decode: decodeNasAddress,
} as const satisfies CheckedCoin;
