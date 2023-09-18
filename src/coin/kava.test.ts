import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeKavaAddress, encodeKavaAddress } from "./kava";

describe.each([
  {
    text: "kava1r4v2zdhdalfj2ydazallqvrus9fkphmglhn6u6",
    hex: "1d58a136edefd32511bd177ff0307c815360df68",
  },
])("kava address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeKavaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeKavaAddress(text)).toEqual(hexToBytes(hex));
  });
});
