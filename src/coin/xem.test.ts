import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXemAddress, encodeXemAddress } from "./xem.js";

describe.each([
  {
    text: "NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6",
    hex: "681f142c5ea4853063ed6dc3c13aaa8257cd7daf1109132a5e",
  },
  {
    text: "NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY",
    hex: "6818e054e5abd3e2bf7ac3f46133dcb4a2c55c1d52b16b1df8",
  },
])("xem address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXemAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXemAddress(text)).toEqual(hexToBytes(hex));
  });
});
