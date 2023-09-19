import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXrpAddress, encodeXrpAddress } from "./xrp";

describe.each([
  {
    text: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
    hex: "004b4e9c06f24296074f7bc48f92a97916c6dc5ea9",
  },
  {
    text: "X7qvLs7gSnNoKvZzNWUT2e8st17QPY64PPe7zriLNuJszeg",
    hex: "05444b4e9c06f24296074f7bc48f92a97916c6dc5ea9000000000000000000",
  },
])("xrp address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXrpAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXrpAddress(text)).toEqual(hexToBytes(hex));
  });
});
