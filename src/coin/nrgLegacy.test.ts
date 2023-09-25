import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNrgLegacyAddress, encodeNrgLegacyAddress } from "./nrgLegacy.js";

describe.each([
  {
    text: "0x7e534bc64A80e56dB3eEDBd1b54639C3A9a7CDEA",
    hex: "7e534bc64a80e56db3eedbd1b54639c3a9a7cdea",
  },
])("nrgLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNrgLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNrgLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
