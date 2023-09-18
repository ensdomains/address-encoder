import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeOneAddress, encodeOneAddress } from "./one";

describe.each([
  {
    text: "one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7",
    hex: "7c41e0668b551f4f902cfaec05b5bdca68b124ce",
  },
])("one address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeOneAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeOneAddress(text)).toEqual(hexToBytes(hex));
  });
});
