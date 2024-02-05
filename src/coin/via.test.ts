import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeViaAddress, encodeViaAddress } from "./via.js";

describe.each([
  {
    text: "Vxgc5PCLkzNkDLkuduQEcrUBF1Z1UUHnav",
    hex: "76a914f8d8b16d9409898a976b66bad157b91b71dc18ca88ac",
  },
  {
    text: "EYg9j8ieF6BQzS9doHnjg3Faj7SdAhfqnV",
    hex: "a914aa423f4ab9ea252abc360ec1dada62ef2527245987",
  },
])("via address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeViaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeViaAddress(text)).toEqual(hexToBytes(hex));
  });
});
