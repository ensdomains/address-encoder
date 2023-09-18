import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeRuneAddress, encodeRuneAddress } from "./rune";

describe.each([
  {
    text: "thor1kljxxccrheghavaw97u78le6yy3sdj7h696nl4",
    hex: "b7e4636303be517eb3ae2fb9e3ff3a212306cbd7",
  },
  {
    text: "thor1yv0mrrygnjs03zsrwrgqz4sa36evfw2a049l5p",
    hex: "231fb18c889ca0f88a0370d001561d8eb2c4b95d",
  },
])("rune address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeRuneAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeRuneAddress(text)).toEqual(hexToBytes(hex));
  });
});
