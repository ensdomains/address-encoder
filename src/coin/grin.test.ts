import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeGrinAddress, encodeGrinAddress } from "./grin.js";

describe.each([
  {
    text: "grin1k6m6sjpwc047zdhsdj9r77v5nnxm33hx7wxqvw5dhd9vl0d7t4fsaqt0lg",
    hex: "b6b7a8482ec3ebe136f06c8a3f79949ccdb8c6e6f38c063a8dbb4acfbdbe5d53",
  },
])("grin address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeGrinAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeGrinAddress(text)).toEqual(hexToBytes(hex));
  });
});
