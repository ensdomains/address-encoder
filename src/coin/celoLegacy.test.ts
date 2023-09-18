import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCeloLegacyAddress, encodeCeloLegacyAddress } from "./celoLegacy";

describe.each([
  {
    text: "0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275",
    hex: "67316300f17f063085ca8bca4bd3f7a5a3c66275",
  },
])("celoLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCeloLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCeloLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
