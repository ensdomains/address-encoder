import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXhvAddress, encodeXhvAddress } from "./xhv.js";

describe.each([
  {
    text: "hvs1VkXQ7qvBzrCuTofumZ52HNBhriXWP5kWcqZAG2VDXKuLwcCN5YaF2A4wmUXrZMGiz97eT9jXQBPp6vmRyTsk2ttY8z6YRU",
    hex: "f4b24b708551a04541bfc33b74edddf8180bee188a01b7581c66452619634bf0b54e866dc481be8f53d1d99a470080185e01c7760aac8c4b3e2336b6b1c53da731ff047530a5df",
  },
])("xhv address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXhvAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXhvAddress(text)).toEqual(hexToBytes(hex));
  });
});
