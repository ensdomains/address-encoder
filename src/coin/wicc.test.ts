import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeWiccAddress, encodeWiccAddress } from "./wicc.js";

describe.each([
  {
    text: "WPCCQwJafaApw6482EkDR6V84arfa47VmT",
    hex: "76a91405b4701f113f51576fd7f6422dfe6ab00f41739488ac",
  },
  {
    text: "WV116oEVxKUzrafgcRZXCNdDN7r7hjt4xV",
    hex: "76a91445672c77361c4f90f95b7c4c721f375a6a99766888ac",
  },
])("wicc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeWiccAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeWiccAddress(text)).toEqual(hexToBytes(hex));
  });
});
