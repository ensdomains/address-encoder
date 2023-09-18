import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBpsAddress, encodeBpsAddress } from "./bps";

describe.each([
  {
    text: "1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i",
    hex: "76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac",
  },
  {
    text: "3CMNFxN1oHBc4R1EpboAL5yzHGgE611Xou",
    hex: "a91474f209f6ea907e2ea48f74fae05782ae8a66525787",
  },
])("bps address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBpsAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBpsAddress(text)).toEqual(hexToBytes(hex));
  });
});
