import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeWanAddress, encodeWanAddress } from "./wan.js";

describe.each([
  {
    text: "0x2eF088E183231C9bEA30d8430937D3A57b7327D4",
    hex: "2ef088e183231c9bea30d8430937d3a57b7327d4",
  },
])("wan address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeWanAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeWanAddress(text)).toEqual(hexToBytes(hex));
  });
});
