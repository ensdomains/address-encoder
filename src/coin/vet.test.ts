import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeVetAddress, encodeVetAddress } from "./vet";

describe.each([
  {
    text: "0x9760b32C0A515F6C8c4E6B7B89AF8964DDaCB985",
    hex: "9760b32c0a515f6c8c4e6b7b89af8964ddacb985",
  },
])("vet address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeVetAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeVetAddress(text)).toEqual(hexToBytes(hex));
  });
});
