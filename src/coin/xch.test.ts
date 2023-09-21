import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXchAddress, encodeXchAddress } from "./xch";

describe.each([
  {
    text: "xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj",
    hex: "4bc6435b409bcbabe53870dae0f03755f6aabb4594c5915ec983acf12a5d1fba",
  },
])("xch address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXchAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXchAddress(text)).toEqual(hexToBytes(hex));
  });
});
