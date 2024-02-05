import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeStrkAddress, encodeStrkAddress } from "./strk.js";

describe.each([
  {
    text: "0x02Fd23d9182193775423497fc0c472E156C57C69E4089A1967fb288A2d84e914",
    hex: "02fd23d9182193775423497fc0c472e156c57c69e4089a1967fb288a2d84e914",
  },
])("strk address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeStrkAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeStrkAddress(text)).toEqual(hexToBytes(hex));
  });
});
