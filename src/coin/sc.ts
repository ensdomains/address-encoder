import { blake2b } from "@noble/hashes/blake2b";
import { concatBytes } from "@noble/hashes/utils";
import { equals } from "uint8arrays";
import { Coin } from "../types";
import {
  bytesToHexWithoutPrefix,
  hexWithoutPrefixToBytes,
} from "../utils/bytes";

const name = "SC";
const coinType = 1991;

const length = 32;
const checksumLength = 6;

const scChecksum = (source: Uint8Array) =>
  blake2b(source, { dkLen: length }).slice(0, checksumLength);

export const encodeScAddress = (source: Uint8Array): string => {
  const checksum = scChecksum(source);
  return bytesToHexWithoutPrefix(concatBytes(source, checksum));
};
export const decodeScAddress = (source: string): Uint8Array => {
  if (source.length !== 76) throw new Error("Unrecognised address format");

  const decoded = hexWithoutPrefixToBytes(source);
  const payload = decoded.slice(0, -checksumLength);
  const checksum = decoded.slice(-checksumLength);
  const newChecksum = scChecksum(payload);

  if (!equals(checksum, newChecksum))
    throw new Error("Unrecognised address format");

  return payload;
};

export const sc = {
  name,
  coinType,
  encode: encodeScAddress,
  decode: decodeScAddress,
} as const satisfies Coin;
