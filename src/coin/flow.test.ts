import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFlowAddress, encodeFlowAddress } from "./flow";

describe.each([{ text: "0xf233dcee88fe0abe", hex: "f233dcee88fe0abe" }])(
  "flow address",
  ({ text, hex }) => {
    test(`encode: ${text}`, () => {
      expect(encodeFlowAddress(hexToBytes(hex))).toEqual(text);
    });
    test(`decode: ${text}`, () => {
      expect(decodeFlowAddress(text)).toEqual(hexToBytes(hex));
    });
  }
);

test("left crop", () => {
  expect(encodeFlowAddress(hexToBytes("aaaaaaaaaaaaaaaaaaaadeadbeef"))).toEqual(
    "0xaaaaaaaadeadbeef"
  );
});

test("left pad", () => {
  expect(encodeFlowAddress(hexToBytes("beef"))).toEqual("0x000000000000beef");
});
