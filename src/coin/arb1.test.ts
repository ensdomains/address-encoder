import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeArb1Address, encodeArb1Address } from "./arb1.js";

describe.each([
  {
    text: "0x314159265dD8dbb310642f98f50C066173C1259b",
    hex: "314159265dd8dbb310642f98f50c066173c1259b",
  },
])("arb1 address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeArb1Address(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeArb1Address(text)).toEqual(hexToBytes(hex));
  });
});
