import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeGxcAddress, encodeGxcAddress } from "./gxc";

describe.each([
  {
    text: "GXC6UKk9URcsCuGxLuRDqEuGzAqDkgKbG8AuWXFXsyzc2r9z7A1kw",
    hex: "02d085655f8060a79a4b12b14e442b8a554ba867bdadce3c2dc39e1a42a01827c0",
  },
])("gxc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeGxcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeGxcAddress(text)).toEqual(hexToBytes(hex));
  });
});
