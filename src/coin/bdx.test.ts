import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBdxAddress, encodeBdxAddress } from "./bdx.js";

describe.each([
  {
    text: "bxdBHRJaUhrFjfHLVESP2KQ7j56LVXhgxBCiJB2fdKvuauVSUpxAqVF3gTvEx9fcd4MditoVxumV3VYFyY35S9TK19JAmCMXz",
    hex: "d101a272642ddf45581910432620975c8a3385df68e1bb3d3cfe4ce1c97b4c5ecab46cca3eca869e100670ba171e59a77b5b8543ecdabc9aaa9f861374856e3e10a8dd024d2d",
  },
])("bdx address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBdxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBdxAddress(text)).toEqual(hexToBytes(hex));
  });
});
