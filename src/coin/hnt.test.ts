import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeHntAddress, encodeHntAddress } from "./hnt";

describe.each([
  {
    text: "13M8dUbxymE3xtiAXszRkGMmezMhBS8Li7wEsMojLdb4Sdxc4wc",
    hex: "01351a71c22fefec2231936ad2826b217ece39d9f77fc6c49639926299c3869295",
  },
  {
    text: "112qB3YaH5bZkCnKA5uRH7tBtGNv2Y5B4smv1jsmvGUzgKT71QpE",
    hex: "00f11444921875e2ef7435513a1d1f1b0fa49e3242956a24383912ec5d4f194077",
  },
])("hnt address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeHntAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeHntAddress(text)).toEqual(hexToBytes(hex));
  });
});
