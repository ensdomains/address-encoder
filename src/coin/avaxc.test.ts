import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAvaxcAddress, encodeAvaxcAddress } from "./avaxc.js";

describe.each([
  {
    text: "0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275",
    hex: "67316300f17f063085ca8bca4bd3f7a5a3c66275",
  },
])("avaxc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAvaxcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAvaxcAddress(text)).toEqual(hexToBytes(hex));
  });
});
