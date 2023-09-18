import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeTfuelAddress, encodeTfuelAddress } from "./tfuel";

describe.each([
  {
    text: "0x3599CF49e80A01BCb879A19599C8a6cd8C8d9aa6",
    hex: "3599cf49e80a01bcb879a19599c8a6cd8c8d9aa6",
  },
])("tfuel address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeTfuelAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeTfuelAddress(text)).toEqual(hexToBytes(hex));
  });
});
