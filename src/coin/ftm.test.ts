import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFtmAddress, encodeFtmAddress } from "./ftm";

describe.each([
  {
    text: "0x314159265dD8dbb310642f98f50C066173C1259b",
    hex: "314159265dd8dbb310642f98f50c066173c1259b",
  },
])("ftm address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeFtmAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeFtmAddress(text)).toEqual(hexToBytes(hex));
  });
});
