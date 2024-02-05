import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeHbarAddress, encodeHbarAddress } from "./hbar.js";

describe.each([
  {
    text: "255.255.1024",
    hex: "000000ff00000000000000ff0000000000000400",
  },
  {
    text: `${2n ** 32n - 1n}.${2n ** 64n - 1n}.${2n ** 64n - 1n}`,
    hex: "ffffffffffffffffffffffffffffffffffffffff",
  },
])("hbar address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeHbarAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeHbarAddress(text)).toEqual(hexToBytes(hex));
  });
});
