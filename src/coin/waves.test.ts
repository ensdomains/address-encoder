import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeWavesAddress, encodeWavesAddress } from "./waves";

describe.each([
  {
    text: "3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115",
    hex: "01575cb3839cef68f8b5650461fe707311e2919c73b945cf1edc",
  },
])("waves address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeWavesAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeWavesAddress(text)).toEqual(hexToBytes(hex));
  });
});
