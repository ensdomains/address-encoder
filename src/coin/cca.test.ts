import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCcaAddress, encodeCcaAddress } from "./cca.js";

describe.each([
  {
    text: "5jZrpsZVkNhDKEuNcYZ1kk2wNWJRbaKy22",
    hex: "76a914c3c95e1effb0f6ebde0ac0751d6bfd69ad98511c88ac",
  },
  {
    text: "5mi7oAoMVL7cVJhXsmWxnTDxTUiBUkR996",
    hex: "76a914db49719be13e8221f6d568a01f9d14adc4f887ff88ac",
  },
])("cca address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCcaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCcaAddress(text)).toEqual(hexToBytes(hex));
  });
});
