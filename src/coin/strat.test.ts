import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeStratAddress, encodeStratAddress } from "./strat.js";

describe.each([
  {
    text: "SdMCMmLjD6NK8ssWt5nH2gtv6XkQXErBRs",
    hex: "76a914b01cb711ec63be7441c350907682a73d00bf7d2888ac",
  },
  {
    text: "STrATiSwHPf36VbqWMUaduaN57A791YP9c",
    hex: "76a91447e5efb0d23a8ffa492d33df862a93e039ab622088ac",
  },
])("strat address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeStratAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeStratAddress(text)).toEqual(hexToBytes(hex));
  });
});
