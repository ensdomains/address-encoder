import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAibAddress, encodeAibAddress } from "./aib";

describe.each([
  {
    text: "AJc4bPnvyvdUhFqaGLB8hhiAPyJdcZvs4Z",
    hex: "76a9141f0d5afac97c916cdaccc0dd1c41cb03fde8452f88ac",
  },
])("aib address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAibAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAibAddress(text)).toEqual(hexToBytes(hex));
  });
});
