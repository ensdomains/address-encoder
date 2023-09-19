import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBchAddress, encodeBchAddress } from "./bch";

describe.each([
  {
    text: "1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu",
    hex: "76a91476a04053bda0a88bda5177b86a15c3b29f55987388ac",
    canonical: "bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
  },
  {
    text: "1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR",
    hex: "76a914cb481232299cd5743151ac4b2d63ae198e7bb0a988ac",
    canonical: "bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy",
  },
  {
    text: "16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb",
    hex: "76a914011f28e473c95f4013d7d53ec5fbc3b42df8ed1088ac",
    canonical: "bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r",
  },
  {
    text: "3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC",
    hex: "a91476a04053bda0a88bda5177b86a15c3b29f55987387",
    canonical: "bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq",
  },
  {
    text: "3LDsS579y7sruadqu11beEJoTjdFiFCdX4",
    hex: "a914cb481232299cd5743151ac4b2d63ae198e7bb0a987",
    canonical: "bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e",
  },
  {
    text: "31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw",
    hex: "a914011f28e473c95f4013d7d53ec5fbc3b42df8ed1087",
    canonical: "bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37",
  },
])("bch address", ({ text, hex, canonical }) => {
  test(`encode: ${canonical}`, () => {
    expect(encodeBchAddress(hexToBytes(hex))).toEqual(canonical);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBchAddress(text)).toEqual(hexToBytes(hex));
  });
  test(`decode: ${canonical}`, () => {
    expect(decodeBchAddress(canonical)).toEqual(hexToBytes(hex));
  });
});
