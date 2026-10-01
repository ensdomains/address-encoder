import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeVaraAddress, encodeVaraAddress } from "./vara.js";

describe.each([
  {
    text: "kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW",
    hex: "d43593c715fdd31c61141abd04a99fd6822c8558854ccde39a5684e7a56da27d",
  },
  {
    text: "kGim5ByTuPokQf21odiQskRXcVEwaunk5PwC4dmGz8M6zuwkq",
    hex: "8eaf04151687736326c9fea17e25fc5287613693c912909cb226aa4794f26a48",
  },
  {
    text: "kGkP3DQEEppWt6nSBjXKrknptM4TEcG5ADGjYqUxE8rg8dvDF",
    hex: "d6596f26439c4841c1bd666fc156130ae123fa8e81d2103339938ec0af952a6b",
  },
])("vara address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeVaraAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeVaraAddress(text)).toEqual(hexToBytes(hex));
  });
});

describe.each([
  {
    reason: "polkadot (prefix 0) address",
    text: "15r3pG5WF4ZdkPCNnNcTDPitghhJAemhmeqAW39JHtwk3N1z",
  },
  {
    reason: "bad checksum",
    text: "kGkP3DQEEppWt6nSBjXKrknptM4TEcG5ADGjYqUxE8rg8dvDG",
  },
  {
    reason: "truncated address",
    text: "kGkP3DQEEppWt6nSBjXKrknptM4TEcG5ADGjYqUxE8rg8dvD",
  },
])("vara address invalid", ({ reason, text }) => {
  test(`decode: ${reason}`, () => {
    expect(() => decodeVaraAddress(text)).toThrow(
      "Unrecognized address format"
    );
  });
});
