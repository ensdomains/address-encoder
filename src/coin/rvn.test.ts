import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeRvnAddress, encodeRvnAddress } from "./rvn";

describe.each([
  {
    text: "RJYZeWxr1Ly8YgcvJU1qD5MR9jUtk14HkN",
    hex: "76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac",
  }, // p2pk
  {
    text: "rGtwTfEisPQ7k8KNggmT4kq2vHpbEV6evU",
    hex: "a91474f209f6ea907e2ea48f74fae05782ae8a66525787",
  }, // p2sh
])("rvn address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeRvnAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeRvnAddress(text)).toEqual(hexToBytes(hex));
  });
});
