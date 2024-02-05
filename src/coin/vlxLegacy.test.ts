import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeVlxAddress, encodeVlxAddress } from "./vlx.js";

describe.each([
  {
    text: "VDTHiswjSTkLFbfh2S5XFsqkLzC11HoBD6",
    hex: "461ea68e5e13c72abf1bd2f0bcae4650521712cdb76276f0d5",
  },
])("vlx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeVlxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeVlxAddress(text)).toEqual(hexToBytes(hex));
  });
});
