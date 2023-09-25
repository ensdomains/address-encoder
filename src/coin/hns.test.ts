import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeHnsAddress, encodeHnsAddress } from "./hns.js";

describe.each([
  {
    text: "hs1qd42hrldu5yqee58se4uj6xctm7nk28r70e84vx",
    hex: "6d5571fdbca1019cd0f0cd792d1b0bdfa7651c7e",
  },
])("hns address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeHnsAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeHnsAddress(text)).toEqual(hexToBytes(hex));
  });
});
