import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCloLegacyAddress, encodeCloLegacyAddress } from "./cloLegacy.js";

describe.each([
  {
    text: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    hex: "5aaeb6053f3e94c9b9a09f33669435e7ef1beaed",
  },
])("cloLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCloLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCloLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
