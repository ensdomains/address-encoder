import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAtomAddress, encodeAtomAddress } from "./atom.js";

describe.each([
  {
    text: "cosmos1depk54cuajgkzea6zpgkq36tnjwdzv4afc3d27",
    hex: "6e436a571cec916167ba105160474b9c9cd132bd",
  },
])("atom address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAtomAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAtomAddress(text)).toEqual(hexToBytes(hex));
  });
});
