import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeElaAddress, encodeElaAddress } from "./ela.js";

describe.each([
  {
    text: "EQDZ4T6YyVkg9mb2cAuLEu8iBKbajQAywF",
    hex: "214d797cc92303dac242b17026e79bbea28eb642f29f0d3582",
  },
])("ela address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeElaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeElaAddress(text)).toEqual(hexToBytes(hex));
  });
});
