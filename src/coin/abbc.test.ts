import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAbbcAddress, encodeAbbcAddress } from "./abbc.js";

describe.each([
  {
    text: "ABBC5i3zbGsuyexJc6NaHv81yPh2WeaqrtYMMVaEqcYLz9guAAV74A",
    hex: "026bff3fc4dc3cde1dcb2068bef16624a260c6f0e330addb54f894bce7fa353de6",
  },
  {
    text: "ABBC5MTKdW6dFqEjYqQYMmLohCsALWcBAx2xRapzDTKAtz3XwKJcaf",
    hex: "023d3a2e33a90f8f5bcbda1ec129ba1eee5e5f2ab6a77d652cbb0517f2b49669e8",
  },
])("abbc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAbbcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAbbcAddress(text)).toEqual(hexToBytes(hex));
  });
});
