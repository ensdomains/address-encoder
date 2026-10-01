import { equalBytes } from "@noble/curves/abstract/utils";
import { blake2b } from "@noble/hashes/blake2b";
import { concatBytes } from "@noble/hashes/utils";
import { base58UncheckedDecode, base58UncheckedEncode } from "./base58.js";

const prefixStringBytes = new Uint8Array([
  0x53, 0x53, 0x35, 0x38, 0x50, 0x52, 0x45,
]);

const dotChecksum = (sourceWithTypePrefix: Uint8Array): Uint8Array =>
  blake2b(concatBytes(prefixStringBytes, sourceWithTypePrefix)).slice(0, 2);

const encodeSs58TypePrefix = (type: number): Uint8Array => {
  if (!Number.isInteger(type) || type < 0 || type > 16383)
    throw new Error("Invalid SS58 network identifier");
  if (type < 64) return new Uint8Array([type]);
  return new Uint8Array([
    ((type & 0b1111_1100) >> 2) | 0b0100_0000,
    (type >> 8) | ((type & 0b0000_0011) << 6),
  ]);
};

export const createDotAddressEncoder = (type: number) => {
  const typePrefix = encodeSs58TypePrefix(type);
  return (source: Uint8Array): string => {
    const sourceWithTypePrefix = concatBytes(typePrefix, source);
    const checksum = dotChecksum(sourceWithTypePrefix);
    return base58UncheckedEncode(concatBytes(sourceWithTypePrefix, checksum));
  };
};

export const createDotAddressDecoder = (type: number) => {
  const typePrefix = encodeSs58TypePrefix(type);
  const prefixLength = typePrefix.length;
  return (source: string): Uint8Array => {
    const decoded = base58UncheckedDecode(source);
    if (decoded.length !== prefixLength + 34)
      throw new Error("Unrecognized address format");
    if (!equalBytes(decoded.slice(0, prefixLength), typePrefix))
      throw new Error("Unrecognized address format");

    const checksum = decoded.slice(prefixLength + 32);
    const newChecksum = dotChecksum(decoded.slice(0, prefixLength + 32));
    if (!equalBytes(checksum, newChecksum))
      throw new Error("Unrecognized address format");

    return decoded.slice(prefixLength, prefixLength + 32);
  };
};
