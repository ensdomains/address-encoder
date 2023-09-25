import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeTtLegacyAddress, encodeTtLegacyAddress } from "./ttLegacy.js";

describe.each([
  {
    text: "0x1001EEc06f2aDff074fC2A9492e132c33d6bd54d",
    hex: "1001eec06f2adff074fc2a9492e132c33d6bd54d",
  },
])("ttLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeTtLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeTtLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
