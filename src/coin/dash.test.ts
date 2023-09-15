import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDashAddress, encodeDashAddress } from "./dash";

describe.each([
  {
    text: "XtAG1982HcYJVibHxRZrBmdzL5YTzj4cA1",
    hex: "76a914bfa98bb8a919330c432e4ff16563c5ab449604ad88ac",
  },
  {
    text: "7gks9gWVmGeir7m4MhsSxMzXC2eXXAuuRD",
    hex: "a9149d646d71f0815c0cfd8cd08aa9d391cd127f378687",
  },
])("dash address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDashAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDashAddress(text)).toEqual(hexToBytes(hex));
  });
});
