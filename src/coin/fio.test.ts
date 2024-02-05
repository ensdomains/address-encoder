import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFioAddress, encodeFioAddress } from "./fio.js";

describe.each([
  {
    text: "FIO7tkpmicyK2YWShSKef6B9XXqBN6LpDJo69oRDfhn67CEnj3L2G",
    hex: "038bb1a68d19eb9139734d0f38da55cfcea955ed8f0baf42f12502e244293c08eb",
  },
])("fio address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeFioAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeFioAddress(text)).toEqual(hexToBytes(hex));
  });
});
