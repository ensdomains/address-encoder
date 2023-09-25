import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeCcxxAddress, encodeCcxxAddress } from "./ccxx.js";

describe.each([
  {
    text: "XVVxhJAGNXP32xAcfCm1mVDLs5dCeodLjL",
    hex: "a914c7188637dfd328e6911d63da67cdbea52507dd3087",
  },
  {
    text: "XKcgJ1jyjwbGCE7wT6GRMKZGjFrkNs2sLb",
    hex: "a9145aac7ca95006faf9244907af1e2b873a6a58e1af87",
  },
])("ccxx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeCcxxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeCcxxAddress(text)).toEqual(hexToBytes(hex));
  });
});
