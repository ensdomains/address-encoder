import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXlmAddress, encodeXlmAddress } from "./xlm.js";

describe.each([
  {
    text: "GAI3GJ2Q3B35AOZJ36C4ANE3HSS4NK7WI6DNO4ZSHRAX6NG7BMX6VJER",
    hex: "11b32750d877d03b29df85c0349b3ca5c6abf64786d773323c417f34df0b2fea",
  },
])("xlm address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXlmAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXlmAddress(text)).toEqual(hexToBytes(hex));
  });
});
