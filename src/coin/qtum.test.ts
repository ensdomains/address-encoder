import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeQtumAddress, encodeQtumAddress } from "./qtum.js";

describe.each([
  {
    text: "Qc6iYCZWn4BauKXGYirRG8pMtgdHMk2dzn",
    hex: "3aa9f8f3b055324f6b2d6bcac328ec2d7e3cd22d8b",
  },
])("qtum address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeQtumAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeQtumAddress(text)).toEqual(hexToBytes(hex));
  });
});
