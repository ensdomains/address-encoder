import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEtcAddress, encodeEtcAddress } from "./etc";

describe.each([
  {
    text: "0x314159265dD8dbb310642f98f50C066173C1259b",
    hex: "314159265dd8dbb310642f98f50c066173c1259b",
  },
])("etc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeEtcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeEtcAddress(text)).toEqual(hexToBytes(hex));
  });
});
