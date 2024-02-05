import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeZilAddress, encodeZilAddress } from "./zil.js";

describe.each([
  {
    text: "zil139tkqvc8rw92e6jrs40gawwc3mmdmmauv3x3yz",
    hex: "89576033071b8aacea43855e8eb9d88ef6ddefbc",
  },
])("zil address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeZilAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeZilAddress(text)).toEqual(hexToBytes(hex));
  });
});
