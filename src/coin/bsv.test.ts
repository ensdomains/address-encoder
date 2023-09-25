import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBsvAddress, encodeBsvAddress } from "./bsv.js";

describe.each([
  {
    text: "1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i",
    hex: "65a16059864a2fdbc7c99a4723a8395bc6f188eb",
  },
  {
    text: "1Ax4gZtb7gAit2TivwejZHYtNNLT18PUXJ",
    hex: "6d23156cbbdcc82a5a47eee4c2c7c583c18b6bf4",
  },
])("bsv address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBsvAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBsvAddress(text)).toEqual(hexToBytes(hex));
  });
});
