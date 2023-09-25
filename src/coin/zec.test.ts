import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeZecAddress, encodeZecAddress } from "./zec.js";

describe.each([
  {
    // P2PKH Transparent Address
    text: "t1b2ArRwLq6KbdJFzJVYPxgUVT1d9QuBzTf",
    hex: "76a914bc18e286d40706de62928155d6167bf30719857888ac",
  },
  {
    // P2SH Transparent Address
    text: "t3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd",
    hex: "a9147d46a730d31f97b1930d3368a967c309bd4d136a87",
  },
  {
    // Sapling Payment Address (shielded address)
    text: "zs1wkejr23wqa9ptpvv73ch3wr96lh8gnyx3689skmyttljy4nyfj69eyclukwkxrhr3rrkgxvnur0",
    hex: "75b321aa2e074a15858cf47178b865d7ee744c868e8e585b645aff2256644cb45c931fe59d630ee388c764",
  },
])("zec address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeZecAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeZecAddress(text)).toEqual(hexToBytes(hex));
  });
});
