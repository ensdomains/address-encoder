import { sha256 } from "@noble/hashes/sha256";
import { concatBytes } from "@noble/hashes/utils";
import { equals } from "uint8arrays";
import { Coin } from "../types";
import {
  base32Decode,
  base32Encode,
  crockfordBase32Options,
} from "../utils/base32";

const name = "stx";
const coinType = 5757;

const prefix = "S";
const length = 20;
const checkumLength = 4;
const p2pkhVersion = new Uint8Array([22]);
const p2shVersion = new Uint8Array([20]);

const stxChecksum = (data: Uint8Array): Uint8Array =>
  sha256(sha256(data)).slice(0, checkumLength);

export const encodeStxAddress = (source: Uint8Array): string => {
  if (source.length !== length + checkumLength)
    throw new Error("Unrecognised address format");
  const hash160 = source.slice(0, length);
  const checksum = source.slice(-checkumLength);

  let version: string;
  let encoded: string;

  if (equals(checksum, stxChecksum(concatBytes(p2pkhVersion, hash160)))) {
    version = "P";
    encoded = base32Encode(source, crockfordBase32Options);
  } else if (equals(checksum, stxChecksum(concatBytes(p2shVersion, hash160)))) {
    version = "M";
    encoded = base32Encode(source, crockfordBase32Options);
  } else throw new Error("Unrecognised address format");

  return `${prefix}${version}${encoded}`;
};
export const decodeStxAddress = (source: string): Uint8Array => {
  if (source.length < 6) throw new Error("Unrecognised address format");
  if (source[0] !== "S") throw new Error("Unrecognised address format");

  const normalised = source.toUpperCase();

  const version = normalised[1];
  let versionBytes: Uint8Array;
  if (version === "P") versionBytes = p2pkhVersion;
  else if (version === "M") versionBytes = p2shVersion;
  else throw new Error("Unrecognised address format");

  const payload = base32Decode(normalised.slice(2), crockfordBase32Options);
  const decoded = payload.slice(0, -checkumLength);
  const checksum = payload.slice(-checkumLength);
  const newChecksum = stxChecksum(concatBytes(versionBytes, decoded));

  if (!equals(checksum, newChecksum))
    throw new Error("Unrecognised address format");

  return payload;
};

export const stx = {
  name,
  coinType,
  encode: encodeStxAddress,
  decode: decodeStxAddress,
} as const satisfies Coin;
