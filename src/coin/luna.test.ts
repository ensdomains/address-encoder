import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeLunaAddress, encodeLunaAddress } from "./luna.js";

describe.each([
  {
    text: "terra1pdx498r0hrc2fj36sjhs8vuhrz9hd2cw0tmam9",
    hex: "0b4d529c6fb8f0a4ca3a84af03b397188b76ab0e",
  },
])("luna address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeLunaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeLunaAddress(text)).toEqual(hexToBytes(hex));
  });
});
