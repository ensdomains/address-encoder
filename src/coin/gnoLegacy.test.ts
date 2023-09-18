import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeGnoLegacyAddress, encodeGnoLegacyAddress } from "./gnoLegacy";

describe.each([
  {
    text: "0x314159265dD8dbb310642f98f50C066173C1259b",
    hex: "314159265dd8dbb310642f98f50c066173c1259b",
  },
])("gnoLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeGnoLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeGnoLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
