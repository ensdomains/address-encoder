import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeKmdAddress, encodeKmdAddress } from "./kmd";

describe.each([
  {
    text: "RDNC9mLrN48pVGDQ5jSoPb2nRsUPJ5t2R7",
    hex: "76a9142cd2a4e3d1c2738ee4fce61e73ea822dcaacb9b488ac",
  },
])("kmd address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeKmdAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeKmdAddress(text)).toEqual(hexToBytes(hex));
  });
});
