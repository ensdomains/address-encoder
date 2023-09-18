import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeLrgAddress, encodeLrgAddress } from "./lrg";

describe.each([
  {
    text: "DM8Zwin2rJczpjy2TXY5UZbZQLkUhYBH61",
    hex: "76a914af687904a4e15a2f1cac37dfb6cbceb9dba8afb788ac",
  },
  {
    text: "6bNNutYQz11WrkVCrj1nUS1dBGyoVZjdEg",
    hex: "a914e613c7be9b53e1a47fd4edb3ea9777cf29dce30f87",
  },
])("lrg address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeLrgAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeLrgAddress(text)).toEqual(hexToBytes(hex));
  });
});
