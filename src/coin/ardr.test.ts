import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeArdrAddress, encodeArdrAddress } from "./ardr.js";

describe.each([
  {
    text: "ARDOR-MT4P-AHG4-A4NA-CCMM2",
    hex: "15021913020e0f080a1313000a08021408",
  },
])("ardr address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeArdrAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeArdrAddress(text)).toEqual(hexToBytes(hex));
  });
});
