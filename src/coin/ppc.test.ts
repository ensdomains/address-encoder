import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodePpcAddress, encodePpcAddress } from "./ppc";

describe.each([
  {
    text: "PRL8bojUujzDGA6HRapzprXWFxMyhpS7Za",
    hex: "76a914b7a1c4349e794ee3484b8f433a7063eb614dfdc788ac",
  },
])("ppc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodePpcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodePpcAddress(text)).toEqual(hexToBytes(hex));
  });
});
