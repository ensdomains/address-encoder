import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNeoAddress, encodeNeoAddress } from "./neo";

describe.each([
  {
    text: "AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF",
    hex: "17ad5cac596a1ef6c18ac1746dfd304f93964354b5",
  },
])("neo address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNeoAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNeoAddress(text)).toEqual(hexToBytes(hex));
  });
});
