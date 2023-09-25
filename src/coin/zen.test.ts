import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeZenAddress, encodeZenAddress } from "./zen.js";

describe.each([
  {
    text: "znc3p7CFNTsz1s6CceskrTxKevQLPoDK4cK",
    hex: "20897843a3fcc6ab7d02d40946360c070b13cf7b9795",
  },
  {
    text: "zswRHzwXtwKVmP8ffKKgWz6A7TB97Fuzx7w",
    hex: "2096b9d286b397a019f3a41ea6495dbce88d753f28a3",
  },
])("zen address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeZenAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeZenAddress(text)).toEqual(hexToBytes(hex));
  });
});
