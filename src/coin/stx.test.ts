import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeStxAddress, encodeStxAddress } from "./stx";

describe.each([
  {
    text: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    hex: "a46ff88886c2ef9762d970b4d2c63678835bd39d71b4ba47",
  },
  {
    text: "SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G",
    hex: "a46ff88886c2ef9762d970b4d2c63678835bd39df7d47410",
  },
])("stx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeStxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeStxAddress(text)).toEqual(hexToBytes(hex));
  });
});
