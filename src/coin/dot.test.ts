import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDotAddress, encodeDotAddress } from "./dot.js";

describe.each([
  {
    text: "1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg",
    hex: "0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b",
  },
])("dot address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDotAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDotAddress(text)).toEqual(hexToBytes(hex));
  });
});

test("dot address: rejects trailing bytes after checksum", () => {
  // valid address for 0xd6596f…2a6b with 0xdead appended to the payload
  expect(() =>
    decodeDotAddress("12dQGTZViQwSYhgT6bUvDGcqb4w7GfrDLE8xkn4kXJyqwn4JzPv")
  ).toThrow("Unrecognized address format");
});
