import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNasAddress, encodeNasAddress } from "./nas.js";

describe.each([
  {
    text: "n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE",
    hex: "195707f964ff495324635f22c7b486e05d7e67c7af5c",
  },
  {
    text: "n1sLnoc7j57YfzAVP8tJ3yK5a2i56QrTDdK",
    hex: "195893f59359e3de8ddb7b4e8e9fe51afcf27c59a4c1",
  },
])("nas address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNasAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNasAddress(text)).toEqual(hexToBytes(hex));
  });
});
