import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAeAddress, encodeAeAddress } from "./ae";

describe.each([
  {
    text: "ak_Gd6iMVsoonGuTF8LeswwDDN2NF5wYHAoTRtzwdEcfS32LWoxm",
    hex: "30782378f892b7cc82c2d2739e994ec9953aa36461f1eb5a4a49a5b0de17b3d23ae8",
  },
])("ae address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAeAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAeAddress(text)).toEqual(hexToBytes(hex));
  });
});
