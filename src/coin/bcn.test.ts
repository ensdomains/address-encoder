import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBcnAddress, encodeBcnAddress } from "./bcn.js";

describe.each([
  {
    text: "21UQFLdH7WvPZEd8HNwXncHtDwFvv4GRqaN3R4cWyuw2TRZxRtRPb7FFTxfcwwQsqYSD2EqhgVCLsGdRdejAoHFHAHJrxxo",
    hex: "0606fd971eb1513f86da272c0e64700d64f013286f1bd024c7768bbfc24b36bd9df9f02985759782567ac26311e9637f96b452da1cb5e15c5d6f0c15cdd107bc52",
  },
  {
    text: "bcnZ6VSM78fQNL5js7VnCybbs3ojLbdAD4DfbdJkUqghYWLqXeEgdyo9UyiAZKnB548DK1ofu8wed3jYCPT62zpf2R97SejoT7",
    hex: "cef6222d354172048bb4e38b4b62d78aceddca4ea16a5b66133dcaec3bc71346bc5c87f5891aa07632b67a864ef9393b2b1e8620181e27b610578d4a899c2d88255f0c",
  },
])("bcn address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBcnAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBcnAddress(text)).toEqual(hexToBytes(hex));
  });
});
