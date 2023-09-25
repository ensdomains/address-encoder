import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeLskAddress, encodeLskAddress } from "./lsk.js";

describe.each([
  { text: "5506432865724830000L", hex: "4c6ac7845d109130" },
  { text: "10588416556841527004L", hex: "92f19cc2346766dc" },
  { text: "4980451641598555896L", hex: "451e1e61667e36f8" },
])("lsk address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeLskAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeLskAddress(text)).toEqual(hexToBytes(hex));
  });
});
