import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeMrxAddress, encodeMrxAddress } from "./mrx.js";

describe.each([
  {
    text: "MPYAKTYDaEMEXWFSxHeMtpXNNiSjK4TVch",
    hex: "32ab8959869ee2579028abdf6a199b049bfae6dc3b",
  },
])("mrx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeMrxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeMrxAddress(text)).toEqual(hexToBytes(hex));
  });
});
