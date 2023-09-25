import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeTtAddress, encodeTtAddress } from "./tt.js";

describe.each([
  {
    text: "0x1001EEc06f2aDff074fC2A9492e132c33d6bd54d",
    hex: "1001eec06f2adff074fc2a9492e132c33d6bd54d",
  },
])("tt address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeTtAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeTtAddress(text)).toEqual(hexToBytes(hex));
  });
});
