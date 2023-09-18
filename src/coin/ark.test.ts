import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeArkAddress, encodeArkAddress } from "./ark";

describe.each([
  {
    text: "AKkCgA5To85YSAgJgxUw8dKJsHkCzsu2dy",
    hex: "172b8f8e3490db00c6cc0dda2d2b9626e681500e29",
  },
])("ark address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeArkAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeArkAddress(text)).toEqual(hexToBytes(hex));
  });
});
