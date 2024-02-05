import { equalBytes } from "@noble/curves/abstract/utils";
import { blake2b } from "@noble/hashes/blake2b";
import { concatBytes } from "@noble/hashes/utils";
import { base58UncheckedDecode, base58UncheckedEncode } from "./base58.js";

const prefixStringBytes = new Uint8Array([
  0x53, 0x53, 0x35, 0x38, 0x50, 0x52, 0x45,
]);

const dotChecksum = (sourceWithTypePrefix: Uint8Array): Uint8Array =>
  blake2b(concatBytes(prefixStringBytes, sourceWithTypePrefix)).slice(0, 2);

export const createDotAddressEncoder =
  (type: number) =>
  (source: Uint8Array): string => {
    const typePrefix = new Uint8Array([type]);
    const sourceWithTypePrefix = concatBytes(typePrefix, source);
    const checksum = dotChecksum(sourceWithTypePrefix);
    return base58UncheckedEncode(concatBytes(sourceWithTypePrefix, checksum));
  };

export const createDotAddressDecoder =
  (type: number) =>
  (source: string): Uint8Array => {
    const decoded = base58UncheckedDecode(source);
    if (decoded[0] !== type) throw new Error("Unrecognized address format");

    const checksum = decoded.slice(33, 35);
    const newChecksum = dotChecksum(decoded.slice(0, 33));
    if (!equalBytes(checksum, newChecksum))
      throw new Error("Unrecognized address format");

    return decoded.slice(1, 33);
  };
