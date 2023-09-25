import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeVsysAddress, encodeVsysAddress } from "./vsys.js";

describe.each([
  {
    text: "ARF12jvtjz9caUFmiwBeRe1SPRGQhUWKrtd",
    hex: "054d878288c4d4e2dd250560e303476b2152703557a0d3aa3396",
  },
])("vsys address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeVsysAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeVsysAddress(text)).toEqual(hexToBytes(hex));
  });
  test(`decode -> encode: ${text}`, () => {
    const decoded = decodeVsysAddress(text);
    const encoded = encodeVsysAddress(decoded);
    expect(encoded).toEqual(text);
  });
});
