import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSuiAddress, encodeSuiAddress } from "./sui.js";

describe.each([
  // Test vectors from Sui documentation and examples
  {
    text: "0x21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c47",
    hex: "21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c47",
  },
  {
    text: "0x0000000000000000000000000000000000000000000000000000000000000001",
    hex: "0000000000000000000000000000000000000000000000000000000000000001",
  },
  // Test case without 0x prefix
  {
    text: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    hex: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  },
])("sui address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSuiAddress(hexToBytes(hex))).toEqual(text.toLowerCase());
  });
  test(`decode: ${text}`, () => {
    expect(decodeSuiAddress(text)).toEqual(hexToBytes(hex));
  });
});

test("SUI decoding - incorrect length", () => {
  expect(() =>
    decodeSuiAddress("0x21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c")
  ).toThrow("Unrecognised address format");
});

test("SUI decoding - invalid hex", () => {
  expect(() =>
    decodeSuiAddress("0x21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c4g")
  ).toThrow("Unrecognised address format");
});

test("SUI encoding - incorrect length", () => {
  expect(() =>
    encodeSuiAddress(
      hexToBytes("21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c")
    )
  ).toThrow("Unrecognised address format");
});

test("SUI decoding - without 0x prefix", () => {
  const address = "21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c47";
  expect(decodeSuiAddress(address)).toEqual(hexToBytes(address));
});

test("SUI encoding/decoding - case insensitive input", () => {
  const upperCaseAddress = "0x21DCEF5BBC5EC6D1789E8B92D3CB2C4D6855DA09BD8197F8B256CA15714A7C47";
  const expectedBytes = hexToBytes("21dcef5bbc5ec6d1789e8b92d3cb2c4d6855da09bd8197f8b256ca15714a7c47");
  
  expect(decodeSuiAddress(upperCaseAddress)).toEqual(expectedBytes);
  expect(encodeSuiAddress(expectedBytes)).toEqual(upperCaseAddress.toLowerCase());
});