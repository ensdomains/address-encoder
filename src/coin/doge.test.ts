import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDogeAddress, encodeDogeAddress } from "./doge";

describe.each([
  {
    text: "DBXu2kgc3xtvCUWFcxFE3r9hEYgmuaaCyD",
    hex: "76a9144620b70031f0e9437e374a2100934fba4911046088ac",
  },
  {
    text: "AF8ekvSf6eiSBRspJjnfzK6d1EM6pnPq3G",
    hex: "a914f8f5d99a9fc21aa676e74d15e7b8134557615bda87",
  },
])("doge address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDogeAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDogeAddress(text)).toEqual(hexToBytes(hex));
  });
});
