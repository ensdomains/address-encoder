import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCkbAddress, encodeCkbAddress } from "./ckb.js";

describe.each([
  {
    text: "ckb1qyqt8xaupvm8837nv3gtc9x0ekkj64vud3jqfwyw5v",
    hex: "0100b39bbc0b3673c7d36450bc14cfcdad2d559c6c64",
  },
])("ckb address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCkbAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCkbAddress(text)).toEqual(hexToBytes(hex));
  });
});
