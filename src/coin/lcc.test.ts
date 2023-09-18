import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeLccAddress, encodeLccAddress } from "./lcc";

describe.each([
  {
    text: "CJkeBGuySxGcdY1wupo7FXT1h8bbv4zFHt",
    hex: "76a914191b4f0395e2e66c9c1d9ab5e77a3455acf2c67188ac",
  },
  {
    text: "MV5hqZU1rNDZ4fubL3Jpc7GMDGHmaVtreg",
    hex: "a914e8592f26abbbc754209ae58b131d54312a313b5787",
  },
  {
    text: "lcc1q45yjegxencjtxslypllvyqfz0xk77mdklxzrcr",
    hex: "0014ad092ca0d99e24b343e40ffec2012279adef6db6",
  },
])("lcc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeLccAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeLccAddress(text)).toEqual(hexToBytes(hex));
  });
});
