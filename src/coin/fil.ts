import { blake2b } from "@noble/hashes/blake2b";
import { concatBytes } from "@noble/hashes/utils";
import { equals } from "uint8arrays";
import { Coin } from "../types";
import {
  base32Decode,
  base32Encode,
  unpaddedBase32Options,
} from "../utils/base32";
import { decodeLeb128, encodeLeb128 } from "../utils/leb128";

const name = "FIL";
const coinType = 461;

const validateFilAddress = (address: string): boolean => {
  if (address.length < 3) return false;
  if (address[0] !== "f") return false;
  if (address[1] === "0") {
    if (address.length > 22) return false;
  } else if (address[1] === "1" || address[1] === "2") {
    if (address.length !== 41) return false;
  } else if (address[1] === "3") {
    if (address.length !== 86) return false;
  } else {
    return false;
  }

  return true;
};

const filChecksum = (source: Uint8Array): Uint8Array =>
  blake2b(source, { dkLen: 4 });

export const encodeFilAddress = (source: Uint8Array): string => {
  const payload = source.slice(1);
  const protocol = source[0];

  if (protocol === 0) {
    const decoded = decodeLeb128(payload);
    return `f${protocol}${decoded}`;
  }
  const checksum = blake2b(source, { dkLen: 4 });
  const bytes = concatBytes(payload, checksum);
  const decoded = base32Encode(bytes, unpaddedBase32Options).toLowerCase();
  return `f${protocol}${decoded}`;
};
export const decodeFilAddress = (source: string): Uint8Array => {
  if (!validateFilAddress(source))
    throw new Error("Unrecognised address format");

  const protocol = parseInt(source[1], 10);
  const protocolByte = new Uint8Array([protocol]);
  const encoded = source.slice(2);

  if (protocol === 0) {
    return concatBytes(protocolByte, encodeLeb128(BigInt(encoded)));
  }

  const payloadWithChecksum = base32Decode(
    encoded.toUpperCase(),
    unpaddedBase32Options
  );
  const payload = payloadWithChecksum.slice(0, -4);
  const checksum = payloadWithChecksum.slice(-4);
  const decoded = concatBytes(protocolByte, payload);

  const newChecksum = filChecksum(decoded);
  if (!equals(checksum, newChecksum))
    throw new Error("Unrecognised address format");

  return decoded;
};

export const fil = {
  name,
  coinType,
  encode: encodeFilAddress,
  decode: decodeFilAddress,
} as const satisfies Coin;
