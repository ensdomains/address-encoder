import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSrmAddress, encodeSrmAddress } from "./srm";

describe.each([
  {
    text: "6ZRCB7AAqGre6c72PRz3MHLC73VMYvJ8bi9KHf1HFpNk",
    hex: "52986010573739df4b58ba50e39cf3f335b89cc7d1cb1d32b5de04efa068c939",
  },
])("srm address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSrmAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeSrmAddress(text)).toEqual(hexToBytes(hex));
  });
});
