import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeIcxAddress, encodeIcxAddress } from "./icx.js";

describe.each([
  {
    text: "hx6b38701ddc411e6f4e84a04f6abade7661a207e2",
    hex: "006b38701ddc411e6f4e84a04f6abade7661a207e2",
  },
  {
    text: "cxa4524257b3511fb9574009785c1f1e73cf4097e7",
    hex: "01a4524257b3511fb9574009785c1f1e73cf4097e7",
  },
])("icx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeIcxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeIcxAddress(text)).toEqual(hexToBytes(hex));
  });
});
