import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEwtAddress, encodeEwtAddress } from "./ewt";

describe.each([
  {
    text: "0x2ce42c2B3aCff7eddcfd32DCB0703F1870b0eBe1",
    hex: "2ce42c2b3acff7eddcfd32dcb0703f1870b0ebe1",
  },
])("ewt address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeEwtAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeEwtAddress(text)).toEqual(hexToBytes(hex));
  });
});
