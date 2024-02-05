import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSteemAddress, encodeSteemAddress } from "./steem.js";

describe.each([
  {
    text: "STM8QykigLRi9ZUcNy1iXGY3KjRuCiLM8Ga49LHti1F8hgawKFc3K",
    hex: "03d0519ddad62bd2a833bee5dc04011c08f77f66338c38d99c685dee1f454cd1b8",
  },
])("steem address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSteemAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeSteemAddress(text)).toEqual(hexToBytes(hex));
  });
});
