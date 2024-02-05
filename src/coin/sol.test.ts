import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSolAddress, encodeSolAddress } from "./sol.js";

describe.each([
  // The address reportetd by Trust Wallet team that it is having problem.
  {
    text: "AHy6YZA8BsHgQfVkk7MbwpAN94iyN7Nf1zN4nPqUN32Q",
    hex: "8a11e71b96cabbe3216e3153b09694f39fc85022cbc076f79846a3ab4d8c1991",
  },
  // https://github.com/trustwallet/wallet-core/blob/8d3100f61e36d1e928ed1dea60ff7554bba0db16/tests/Solana/AddressTests.cpp#L26
  {
    text: "2gVkYWexTHR5Hb2aLeQN3tnngvWzisFKXDUPrgMHpdST",
    hex: "18f9d8d877393bbbe8d697a8a2e52879cc7e84f467656d1cce6bab5a8d2637ec",
  },
  // https://explorer.solana.com/address/CNR8RPMxjY28VsPA6KFq3B8PUdZnrTSC5HSFwKPBR29Z
  {
    text: "CNR8RPMxjY28VsPA6KFq3B8PUdZnrTSC5HSFwKPBR29Z",
    hex: "a8ed08e3e8fe204de45e7295cc1ad53db096621b878f8c546e5c09f5e48f70b4",
  },
])("sol address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSolAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeSolAddress(text)).toEqual(hexToBytes(hex));
  });
});

test("SOL decoding - incorrect length", () => {
  expect(() =>
    decodeSolAddress("CNR8RPMxjY28VsPA6KFq3B8PUdZnrTSC5HSFwKPBR2")
  ).toThrow("Unrecognised address format");
});

test("SOL encoding - incorrect length", () => {
  expect(() =>
    encodeSolAddress(
      hexToBytes("a8ed08e3e8fe204de45e7295cc1ad53db096621b878f8c546e5c09f5e48f")
    )
  ).toThrow("Unrecognised address format");
});
