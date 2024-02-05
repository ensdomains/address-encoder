import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBtmAddress, encodeBtmAddress } from "./btm.js";

describe.each([
  {
    text: "bm1qw508d6qejxtdg4y5r3zarvary0c5xw7k23gyyf",
    hex: "0014751e76e8199196d454941c45d1b3a323f1433bd6",
  },
  {
    text: "bm1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qk5egtg",
    hex: "00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262",
  },
])("btm address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBtmAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBtmAddress(text)).toEqual(hexToBytes(hex));
  });
});
