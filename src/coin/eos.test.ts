import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEosAddress, encodeEosAddress } from "./eos.js";

describe.each([
  {
    text: "EOS7pyZLEjxhkSBYnPJf585vcZrqdQoA4KsRHDej6i3vsnV7aseh9",
    hex: "03831c26f94b3af1a5f73ec3b961bc617b35bd99afe74bc1fe2c15d6d09bd4a416",
  },
  {
    text: "EOS51imoRdUT7THtgrrVxPfYwRk3V5jVmrj18D7hbk1FQFexNmCv1",
    hex: "02106b727b87e01b0a298253655e7b0848ce3f4ec152ae6574643c0400ec3d1816",
  },
])("eos address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeEosAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeEosAddress(text)).toEqual(hexToBytes(hex));
  });
});
