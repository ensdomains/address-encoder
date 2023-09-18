import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeRskAddress, encodeRskAddress } from "./rsk";

describe.each([
  {
    text: "0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD",
    hex: "5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD",
  },
])("rsk address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeRskAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeRskAddress(text)).toEqual(hexToBytes(hex));
  });
});
