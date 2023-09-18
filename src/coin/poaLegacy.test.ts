import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodePoaLegacyAddress, encodePoaLegacyAddress } from "./poaLegacy";

describe.each([
  {
    text: "0xF977814e90dA44bFA03b6295A0616a897441aceC",
    hex: "f977814e90da44bfa03b6295a0616a897441acec",
  },
  {
    text: "0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8",
    hex: "be0eb53f46cd790cd13851d5eff43d12404d33e8",
  },
])("poaLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodePoaLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodePoaLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
