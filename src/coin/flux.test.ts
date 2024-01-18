import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFluxAddress, encodeFluxAddress } from "./flux.js";

describe.each([
  {
    text: "t1XWTigDqS5Dy9McwQc752ShtZV1ffTMJB3",
    hex: "76a91495921ba2fc5277d8a35b0e2d339987d51681c51d88ac",
  },
  {
    text: "t3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih",
    hex: "a914c008da0bbc92b35ff71f613ca10ff11e2a6ae2fe87",
  },
])("zel address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeFluxAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeFluxAddress(text)).toEqual(hexToBytes(hex));
  });
});
