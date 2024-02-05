import { keccak_256 } from "@noble/hashes/sha3";
import type { CheckedCoin } from "../types.js";
import {
  bytesToHexWithoutPrefix,
  hexToBytes,
  type Hex,
} from "../utils/bytes.js";
import { rawChecksumAddress } from "../utils/hex.js";

const name = "strk";
const coinType = 9004;

const addressLength = 32;

const addressRegex = /^0x[a-fA-F0-9]{64}$/;

const strkChecksum = (source: Uint8Array): string => {
  const chars = bytesToHexWithoutPrefix(source).toLowerCase().split("");
  const sourceLeadingZeroIndex = source.findIndex((byte) => byte !== 0x00);
  const leadingZeroStripped =
    sourceLeadingZeroIndex > 0 ? source.slice(sourceLeadingZeroIndex) : source;
  const hash = new Uint8Array(32);
  hash.set(keccak_256(leadingZeroStripped), sourceLeadingZeroIndex);
  return rawChecksumAddress({ address: chars, hash, length: 64 });
};

export const encodeStrkAddress = (source: Uint8Array): string => {
  if (source.length !== addressLength)
    throw new Error("Unrecognised address format");

  return strkChecksum(source);
};
export const decodeStrkAddress = (source: string): Uint8Array => {
  if (!addressRegex.test(source))
    throw new Error("Unrecognised address format");

  const decoded = hexToBytes(source as Hex);

  if (strkChecksum(decoded) !== source)
    throw new Error("Unrecognised address format");

  return decoded;
};

export const strk = {
  name,
  coinType,
  encode: encodeStrkAddress,
  decode: decodeStrkAddress,
} as const satisfies CheckedCoin;
