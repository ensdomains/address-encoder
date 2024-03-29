import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeHiveAddress, encodeHiveAddress } from "./hive.js";

describe.each([
  {
    text: "STM8QykigLRi9ZUcNy1iXGY3KjRuCiLM8Ga49LHti1F8hgawKFc3K",
    hex: "03d0519ddad62bd2a833bee5dc04011c08f77f66338c38d99c685dee1f454cd1b8",
  },
])("hive address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeHiveAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeHiveAddress(text)).toEqual(hexToBytes(hex));
  });
});
