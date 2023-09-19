import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAlgoAddress, encodeAlgoAddress } from "./algo";

describe.each([
  {
    text: "7777777777777777777777777777777777777777777777777774MSJUVU",
    hex: "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
  },
  {
    text: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ",
    hex: "0000000000000000000000000000000000000000000000000000000000000000",
  },
])("algo address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAlgoAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAlgoAddress(text)).toEqual(hexToBytes(hex));
  });
});
