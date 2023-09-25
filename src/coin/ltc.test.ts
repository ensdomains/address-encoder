import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeLtcAddress, encodeLtcAddress } from "./ltc.js";

describe.each([
  {
    text: "LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz",
    hex: "76a914a5f4d12ce3685781b227c1f39548ddef429e978388ac",
  },
  {
    text: "MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441",
    hex: "a914b48297bff5dadecc5f36145cec6a5f20d57c8f9b87",
  },
  {
    text: "ltc1qdp7p2rpx4a2f80h7a4crvppczgg4egmv5c78w8",
    hex: "0014687c150c26af5493befeed7036043812115ca36c",
  },
])("ltc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeLtcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeLtcAddress(text)).toEqual(hexToBytes(hex));
  });
});
