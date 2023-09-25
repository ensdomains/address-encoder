import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeIrisAddress, encodeIrisAddress } from "./iris.js";

describe.each([
  {
    text: "iaa1k5y45px87c42ttxgk8x4y6w0y9gzgcwvvunht5",
    hex: "b5095a04c7f62aa5acc8b1cd5269cf21502461cc",
  },
])("iris address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeIrisAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeIrisAddress(text)).toEqual(hexToBytes(hex));
  });
});
