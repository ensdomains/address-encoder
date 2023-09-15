import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeMonaAddress, encodeMonaAddress } from "./mona";

describe.each([
  {
    text: "MHxgS2XMXjeJ4if2PRRbWYcdwZPWfdwaDT",
    hex: "76a9146e5bb7226a337fe8307b4192ae5c3fab9fa9edf588ac",
  },
  {
    text: "PHjTKtgYLTJ9D2Bzw2f6xBB41KBm2HeGfg",
    hex: "a9146449f568c9cd2378138f2636e1567112a184a9e887",
  },
  {
    text: "mona1zw508d6qejxtdg4y5r3zarvaryvhm3vz7",
    hex: "5210751e76e8199196d454941c45d1b3a323",
  },
])("mona address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeMonaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeMonaAddress(text)).toEqual(hexToBytes(hex));
  });
});
