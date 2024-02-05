import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeEgldAddress, encodeEgldAddress } from "./egld.js";

describe.each([
  {
    text: "erd1qdzvfpa7gqjsnfhdxhvcp2mlysc80uz60yjhxre3lwl00q0jd4nqgauy9q",
    hex: "0344c487be402509a6ed35d980ab7f243077f05a7925730f31fbbef781f26d66",
  },
])("egld address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeEgldAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeEgldAddress(text)).toEqual(hexToBytes(hex));
  });
});
