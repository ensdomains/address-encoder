import { base58UncheckedDecode, base58UncheckedEncode } from "./base58.js";
import { TaggedValue, cborDecode, cborEncode } from "./cbor.js";
import { crc32 } from "./crc32.js";

export const byronEncode = (source: Uint8Array): string => {
  const checksum = crc32(source);
  const taggedValue = new TaggedValue(source.buffer, 24);

  const cborEncodedAddress = cborEncode([taggedValue, checksum]);

  const address = base58UncheckedEncode(new Uint8Array(cborEncodedAddress));

  if (!address.startsWith("Ae2") && !address.startsWith("Ddz"))
    throw new Error("Unrecognised address format");

  return address;
};

export const byronDecode = (source: string): Uint8Array => {
  const bytes = base58UncheckedDecode(source);

  const cborDecoded = cborDecode(bytes.buffer);

  const taggedAddress = cborDecoded[0];
  if (taggedAddress === undefined)
    throw new Error("Unrecognised address format");

  const checksum = cborDecoded[1];
  const newChecksum = crc32(taggedAddress.value);

  if (checksum !== newChecksum) throw new Error("Unrecognised address format");

  return taggedAddress.value;
};
