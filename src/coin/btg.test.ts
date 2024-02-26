import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBtgAddress, encodeBtgAddress } from "./btg.js";

describe.each([
  {
    text: "GT7Hz8QWPNmrZ9Z1mEgpYKN7Jdp97eoQjN",
    hex: "76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac",
  },
  {
    text: "AQRA16uKrFpxzR17yidYtJDn2t287dc1XY",
    hex: "a9145ece0cadddc415b1980f001785947120acdb36fc87",
  },
  {
    text: "btg1zw508d6qejxtdg4y5r3zarvaryvl9f8z2",
    hex: "5210751e76e8199196d454941c45d1b3a323",
  },
  {
    text: "btg1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kdd2qs6",
    hex: "5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6",
  },
])("btg address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBtgAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBtgAddress(text)).toEqual(hexToBytes(hex));
  });
});
