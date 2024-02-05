import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNimAddress, encodeNimAddress } from "./nim.js";

describe.each([
  {
    text: "NQ18 GAL5 Y1FC 66VV PE1X J82Q 0A2F LYPB 2EY7",
    hex: "82a85f85ec31bbdbb83e920580284fa7eeb13be7",
  },
])("nim address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNimAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNimAddress(text)).toEqual(hexToBytes(hex));
  });
});
