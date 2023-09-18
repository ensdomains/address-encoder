import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDiviAddress, encodeDiviAddress } from "./divi";

describe.each([
  {
    text: "D8gBQyHPm7A673utQQwBaQcX2Kz91wJovR",
    hex: "76a91426c95750c1afe443b3351ea5923d5bae09c2a74b88ac",
  },
  {
    text: "DSQvV5yKP5m2tR6uShpt8zmeM8UavPhwfH",
    hex: "76a914e958e753703fa13eb63b39a92d1f17f06abead5e88ac",
  },
])("divi address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDiviAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDiviAddress(text)).toEqual(hexToBytes(hex));
  });
});
