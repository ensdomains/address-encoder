import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeSeroAddress, encodeSeroAddress } from "./sero.js";

describe.each([
  {
    text: "p2ya5oepEuHAdcPrn5pfNZTpLMv15ub6vmCmMyqbavPCdxpQ7BVQomCnR2Gv2YQrGUKXYEzstzyUkP7WYef2Kb6ciRcp6eazH8LhjX5cTyJc9Zs2sR7SCSNGJJuJ5K5ihUT",
    hex: "8889d697ff9f3bc140d6df1679edaf9be975bf41d655c7db7ba8d5d5f7d86b17434b9660b7ccd9f8df866c698d81cf7ae8ae10f6a4c0a17aa36db766fee3ca9ecc7af78b9506a414c2acfbba2adaf5fa811612bd8cc534ea3e083eac6464c340",
  },
  {
    text: "SPpb3UAuzAarWVDgyU6FTtS3X5dBucTQXb89ydjqXjABiNg8x3v8jPTrGWqo974BtPvuWt9zqBKJXYyEFYjZ3CS5D2jUhncTGmYQCHFWHSAFRyM4kuBhqWcgekPm5z3Jdwj",
    hex: "49b767bca9137dbbf58eafde5936ddeb843747f450252fbe6c178094cbf76290f575a84bae4565774a0b0098df0fafae874dafc5b628c621b8ccb0ef7372562f10ed5a7343d295c1ca53235d97e7dd9c5ce957e747cbfa2d0c34af1ccacb23de",
  },
  {
    text: "Gwdm8LqXkvmSuhS6MAP1XQEedzNJ6msxcUAFCfRi2vS8hxXGkpcxUmtBaPVS8bY6yuacyS4FD2ZfGGoP2ioYcUU4pXmxJQYa8XphWffmtsAiVbreRRWZdzFUjWsZUb8WXar",
    hex: "2e476e68ec4f9dc8b7e4d41dddd07e84ecf7a777fa9229ac7886d5c1499d4c81fe5075976c6025bbd1081caabd587543ce3ce9a2a6a11b4972c951f99f6a36a535c608d00bd7cc5f5314151b7270e820ecff823f0a55e1563a3816cd6b39ffdb",
  },
])("sero address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeSeroAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeSeroAddress(text)).toEqual(hexToBytes(hex));
  });
});
