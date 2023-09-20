import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeIotaAddress, encodeIotaAddress } from "./iota";

describe.each([
  {
    text: "iota1qpw6k49dedaxrt854rau02talgfshgt0jlm5w8x9nk5ts6f5x5m759nh2ml",
    hex: "5dab54adcb7a61acf4a8fbc7a97dfa130ba16f97f7471cc59da8b869343537ea",
  },
  {
    text: "iota1qrhacyfwlcnzkvzteumekfkrrwks98mpdm37cj4xx3drvmjvnep6xqgyzyx",
    hex: "efdc112efe262b304bcf379b26c31bad029f616ee3ec4aa6345a366e4c9e43a3",
  },
])("iota address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeIotaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeIotaAddress(text)).toEqual(hexToBytes(hex));
  });
});
