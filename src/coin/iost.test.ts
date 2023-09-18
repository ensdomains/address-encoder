import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeIostAddress, encodeIostAddress } from "./iost";

describe.each([
  {
    text: "BkHuWzs6x2wUcuDwcodwQSaWUfZHiN7SfF3vBKy1U2Qg",
    hex: "9fabf5897177aabbd3c3d6052b351fe6c6c36d603dba257eb5bad3a17930ca39",
  },
])("iost address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeIostAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeIostAddress(text)).toEqual(hexToBytes(hex));
  });
});
