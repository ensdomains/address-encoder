import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeTrxAddress, encodeTrxAddress } from "./trx.js";

describe.each([
  {
    text: "TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh",
    hex: "41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1",
  },
  {
    text: "TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW",
    hex: "415a523b449890854c8fc460ab602df9f31fe4293f",
  },
])("trx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeTrxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeTrxAddress(text)).toEqual(hexToBytes(hex));
  });
});
