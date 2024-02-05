import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeArAddress, encodeArAddress } from "./ar.js";

describe.each([
  {
    text: "GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk",
    hex: "19143bb3040ed403321609ee00f23b02f190956de5cee42ec2525b229595ef19",
  },
])("ar address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeArAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeArAddress(text)).toEqual(hexToBytes(hex));
  });
});
