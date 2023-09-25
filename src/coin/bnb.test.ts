import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBnbAddress, encodeBnbAddress } from "./bnb.js";

describe.each([
  {
    text: "bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2",
    hex: "40c2979694bbc961023d1d27be6fc4d21a9febe6",
  },
])("bnb address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBnbAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBnbAddress(text)).toEqual(hexToBytes(hex));
  });
});
