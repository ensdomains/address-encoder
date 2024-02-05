import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXvgAddress, encodeXvgAddress } from "./xvg.js";

describe.each([
  {
    text: "D7MKQnLxXEqn84PN42jWAVhvrXEuULLV9r",
    hex: "76a914183ffcc41f3095bea7ff324e52a65b46c74126e188ac",
  },
])("xvg address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXvgAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXvgAddress(text)).toEqual(hexToBytes(hex));
  });
});
