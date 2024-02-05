import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAvaxAddress, encodeAvaxAddress } from "./avax.js";

describe.each([
  {
    text: "avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
    hex: "ed2fa615d99a0e8e73b7d77bbea33d79af06bebb",
    canonical: "avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
  },
  {
    text: "P-avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
    hex: "ed2fa615d99a0e8e73b7d77bbea33d79af06bebb",
    canonical: "avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
  },
  {
    text: "X-avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
    hex: "ed2fa615d99a0e8e73b7d77bbea33d79af06bebb",
    canonical: "avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun",
  },
])("avax address", ({ text, hex, canonical }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAvaxAddress(hexToBytes(hex))).toEqual(canonical);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAvaxAddress(text)).toEqual(hexToBytes(hex));
  });
});
