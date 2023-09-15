import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeDgbAddress, encodeDgbAddress } from "./dgb";

describe.each([
  {
    text: "dgb1q6fdfum8w0052aqmqjhpcpjzuyg4jlwjy9jrwz9",
    hex: "0014d25a9e6cee7be8ae836095c380c85c222b2fba44",
  },
  {
    text: "DPPWe2aK4aYj3rt3yvw9zstCDXrN6frS7a",
    hex: "76a914c82c346ddb007e70fbb73edcbe104ecceea97bd188ac",
  },
  {
    text: "SRFLzWuizzCPQDc5qLM2L8pZkvFws6We3j",
    hex: "a9142b5feabcb3feb6c45f9b623a7f1bc16be7377db787",
  },
])("dgb address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeDgbAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeDgbAddress(text)).toEqual(hexToBytes(hex));
  });
});
