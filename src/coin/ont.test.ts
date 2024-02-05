import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeOntAddress, encodeOntAddress } from "./ont.js";

describe.each([
  {
    text: "ALvmTSEjNREwcRNJiLcTkxCnsXBfbZEUFK",
    hex: "3887346ea0b83129ff21f1ef3e6008a80373d1b3",
  },
  {
    text: "AavjHwiNfkr7xKGHBpNEQYSL5QiKgRjZf1",
    hex: "d21728df85b2b457908bd33def8ff493d47f184a",
  },
  {
    text: "AGmV3oHqzfAs3VFiqmn6cecxCXVNyg6tNh",
    hex: "0ae542fee226c044dc19b036db7cec939777596f",
  },
])("ont address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeOntAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeOntAddress(text)).toEqual(hexToBytes(hex));
  });
});
