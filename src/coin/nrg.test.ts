import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNrgAddress, encodeNrgAddress } from "./nrg.js";

describe.each([
  {
    text: "0x7e534bc64A80e56dB3eEDBd1b54639C3A9a7CDEA",
    hex: "7e534bc64a80e56db3eedbd1b54639c3a9a7cdea",
  },
])("nrg address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNrgAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNrgAddress(text)).toEqual(hexToBytes(hex));
  });
});
