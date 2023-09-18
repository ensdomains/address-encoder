import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCloAddress, encodeCloAddress } from "./clo";

describe.each([
  {
    text: "0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed",
    hex: "5aaeb6053f3e94c9b9a09f33669435e7ef1beaed",
  },
])("clo address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCloAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCloAddress(text)).toEqual(hexToBytes(hex));
  });
});
