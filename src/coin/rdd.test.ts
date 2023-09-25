import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeRddAddress, encodeRddAddress } from "./rdd.js";

describe.each([
  {
    text: "RkQDYcqiv7mzQfNYMc8FfYv3dtQ8wuSGoM",
    hex: "76a914814089fb909f05918d54e530f0ad8e339a4edffe88ac",
  },
  {
    text: "3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC",
    hex: "a914f815b036d9bbbce5e9f2a00abd1bf3dc91e9551087",
  },
])("rdd address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeRddAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeRddAddress(text)).toEqual(hexToBytes(hex));
  });
});
