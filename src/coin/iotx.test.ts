import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeIotxAddress, encodeIotxAddress } from "./iotx.js";

describe.each([
  {
    text: "io1nyjs526mnqcsx4twa7nptkg08eclsw5c2dywp4",
    hex: "99250a2b5b983103556eefa615d90f3e71f83a98",
  },
])("iotx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeIotxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeIotxAddress(text)).toEqual(hexToBytes(hex));
  });
});
