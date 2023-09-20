import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAionAddress, encodeAionAddress } from "./aion";

describe.each([
  {
    text: "0xa0c24fbbecf42184d1ca8e9401ddaa2a99f69f3560e3d6c673de3c8a0be2a8eb",
    hex: "a0c24fbbecf42184d1ca8e9401ddaa2a99f69f3560e3d6c673de3c8a0be2a8eb",
  },
])("aion address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAionAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAionAddress(text)).toEqual(hexToBytes(hex));
  });
});
