import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeBtcAddress, encodeBtcAddress } from "./btc.js";

describe.each([
  {
    text: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
    hex: "76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac",
  },
  {
    text: "3Ai1JZ8pdJb2ksieUV8FsxSNVJCpoPi8W6",
    hex: "a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1887",
  },
  {
    text: "bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4",
    hex: "0014751e76e8199196d454941c45d1b3a323f1433bd6",
  },
  {
    text: "bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx",
    hex: "5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6",
  },
  { text: "bc1sw50qa3jx3s", hex: "6002751e" },
  {
    text: "bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj",
    hex: "5210751e76e8199196d454941c45d1b3a323",
  },
  {
    text: "bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3",
    hex: "00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262",
  },
])("btc address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeBtcAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeBtcAddress(text)).toEqual(hexToBytes(hex));
  });
});
