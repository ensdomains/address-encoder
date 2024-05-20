import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEthAddress, encodeEthAddress } from "./eth.js";

const prefixlessAddress = "314159265dD8dbb310642f98f50C066173C1259b";
const hex = "314159265dd8dbb310642f98f50c066173c1259b";

test(`eth address: encode 0x${prefixlessAddress}`, () => {
  expect(encodeEthAddress(hexToBytes(hex))).toEqual(`0x${prefixlessAddress}`);
});
test("eth address: invalid checksum", () => {
  expect(() =>
    decodeEthAddress("0x314159265Dd8Dbb310642f98F50C066173C1259b")
  ).toThrow();
});

describe.each([
  {
    // checksummed address
    text: `0x${prefixlessAddress}`,
  },
  {
    // all lowercased address
    text: `0x${prefixlessAddress.toLowerCase()}`,
  },
  {
    // all uppercased address
    text: `0x${prefixlessAddress.toUpperCase()}`,
  },
])("eth address", ({ text }) => {
  test(`decode: ${text}`, () => {
    expect(decodeEthAddress(text)).toEqual(hexToBytes(hex));
  });
});
