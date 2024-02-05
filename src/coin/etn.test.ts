import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEtnAddress, encodeEtnAddress } from "./etn.js";

describe.each([
  {
    text: "45Jmf8PnJKziGyrLouJMeBFw2yVyX1QB52sKEQ4S1VSU2NVsaVGPNu4bWKkaHaeZ6tWCepP6iceZk8XhTLzDaEVa72QrtVh",
    hex: "6135cf83f4b3f9f6c52cb0dc0f91245945346c1ece03640b2a3c5eb9acdf650831d0b00f0a1ddfce4b9bf7df1df46dae94ac6229e492c72d03b94e3609159535",
  },
  {
    text: "46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em",
    hex: "785b9309dd604860fa86133edbabfae7f89d216b1676de44025e98dc13429f398265b4c125b0c061663e76939027cd22e83520282b05ee2d4803049aefaefe01",
  },
])("etn address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeEtnAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeEtnAddress(text)).toEqual(hexToBytes(hex));
  });
});
