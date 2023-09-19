import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNanoAddress, encodeNanoAddress } from "./nano";

describe.each([
  {
    text: "nano_15dng9kx49xfumkm4q6qpaxneie6oynebiwpums3ktdd6t3f3dhp69nxgb38",
    hex: "0d7471e5d11faddce5315c97b23b464184afa8c4c396dcf219696b2682d0adf6",
  },
  {
    text: "nano_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs",
    hex: "2298fab7c61058e77ea554cb93edeeda0692cbfcc540ab213b2836b29029e23a",
  },
])("nano address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNanoAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNanoAddress(text)).toEqual(hexToBytes(hex));
  });
});
