import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeScAddress, encodeScAddress } from "./sc";

describe.each([
  {
    text: "dfb563d6ec6ff876a059fcc96380a6d6718e1a7237e81580123070976243b77988cf8d0b7398",
    hex: "dfb563d6ec6ff876a059fcc96380a6d6718e1a7237e81580123070976243b779",
  },
])("sc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeScAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeScAddress(text)).toEqual(hexToBytes(hex));
  });
});
