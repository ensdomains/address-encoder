import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNulsAddress, encodeNulsAddress } from "./nuls.js";

describe.each([
  {
    text: "NULSd6HgXY3zLvEoCRUa6yFXwpnF8gqrDeToT",
    hex: "0100013ba3e3c56062266262514c74fafb01852af99fec",
  },
  {
    text: "tNULSeBaMvEtDfvZuukDf2mVyfGo3DdiN8KLRG",
    hex: "020001f7ec6473df12e751d64cf20a8baa7edd50810f81",
  },
  {
    text: "AHUcC84FN4CWrhuMgvvGPy6UacBvcutgQ4rAR",
    hex: "79ff019fe3eff24409addcefe8f5115e17e5dfdd5f04c2",
  },
  {
    text: "APNcCm4yik6XXquTHUNbHqfPhGrfcSoGoMudc",
    hex: "80ff01acfa253cc35655e300061e2563f813c5e4b9589c",
  },
])("nuls address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNulsAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNulsAddress(text)).toEqual(hexToBytes(hex));
  });
});
