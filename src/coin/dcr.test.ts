import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDcrAddress, encodeDcrAddress } from "./dcr";

describe.each([
  {
    text: "DsnBFk2BdqYP3WEmChpL7TSonhpxUAi8wiA",
    hex: "073fe8b089c48ba23c60c64c5226d47acfb26565e313934d5d73",
  },
])("dcr address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDcrAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDcrAddress(text)).toEqual(hexToBytes(hex));
  });
});
