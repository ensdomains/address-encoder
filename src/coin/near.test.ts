import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeNearAddress, encodeNearAddress } from "./near.js";

describe.each([
  {
    text: "9902c136629fc630416e50d4f2fef6aff867ea7e.lockup.near",
    hex: "393930326331333636323966633633303431366535306434663266656636616666383637656137652e6c6f636b75702e6e656172",
  },
  { text: "blah.com", hex: "626c61682e636f6d" },
  {
    text: "9685af3fe2dc231e5069ccff8ec6950eb961d42ebb9116a8ab9c0d38f9e45249",
    hex: "39363835616633666532646332333165353036396363666638656336393530656239363164343265626239313136613861623963306433386639653435323439",
  },
])("near address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeNearAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeNearAddress(text)).toEqual(hexToBytes(hex));
  });
});
