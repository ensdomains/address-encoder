import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFiroAddress, encodeFiroAddress } from "./firo.js";

describe.each([
  {
    text: "aJpBLBFFkxY1iGfBmZCTWQQABPqakQwWZ3",
    hex: "76a914c6870ff00109a0aaca255e609de7d40d245aa61788ac",
  },
  {
    text: "a4roLhCKc2m3RtG7ucoxyJrCk2JqayqdSr",
    hex: "76a9142d743121ff929299be3c4488ce64e22634d58d5f88ac",
  },
  {
    text: "Zzn3ivpQZ3XoTnEBUuqPuVCMJ3JBGoxmsi",
    hex: "76a91400ad9d984a8217ffe6548ef5c91b12e6c8d2c10788ac",
  },
])("firo address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeFiroAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeFiroAddress(text)).toEqual(hexToBytes(hex));
  });
});
