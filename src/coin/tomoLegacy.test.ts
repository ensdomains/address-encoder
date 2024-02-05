import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import {
  decodeTomoLegacyAddress,
  encodeTomoLegacyAddress,
} from "./tomoLegacy.js";

describe.each([
  {
    text: "0xf5C9206843DAe847DdFd551ef7b850895430EcA3",
    hex: "f5c9206843dae847ddfd551ef7b850895430eca3",
  },
  {
    text: "0x15813DAE07E373DC800690031A1385eB7faDe49F",
    hex: "15813dae07e373dc800690031a1385eb7fade49f",
  },
])("tomoLegacy address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeTomoLegacyAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeTomoLegacyAddress(text)).toEqual(hexToBytes(hex));
  });
});
