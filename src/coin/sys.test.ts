import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSysAddress, encodeSysAddress } from "./sys.js";

describe.each([
  {
    text: "SVoQzrfQpoiYsrHMXvwbgeJZooqw8zPF9Q",
    hex: "76a9145d5113254a2fb792d209b2731b7c05ee9441aa9088ac",
  },
  {
    text: "SdQRVkLTiYCA75o4hE4TMjMCJL8CytF31G",
    hex: "76a914b0b8ee03d302db1bd6ef689a73de764e3157909588ac",
  },
  {
    text: "sys1q42jdpqq4369ze73rskkrncplcv7mtejhdkxj90",
    hex: "0014aaa4d080158e8a2cfa2385ac39e03fc33db5e657",
  },
  {
    text: "sys1qlfz9tcds52ajh25v2a85ur22rt2mm488twvs5l",
    hex: "0014fa4455e1b0a2bb2baa8c574f4e0d4a1ad5bdd4e7",
  },
])("sys address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSysAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeSysAddress(text)).toEqual(hexToBytes(hex));
  });
});
