import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeAdaAddress, encodeAdaAddress } from "./ada.js";

describe.each([
  {
    text: "Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi",
    hex: "83581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda000",
  },
  {
    text: "DdzFFzCqrhsiMfvZtvTgqbR5jT4UAMEwJCT2bBvWSTiN736tSSxhnhHbmJYUhTiuZGgojfi3jizinGRVUdBF9QHgWHi11nEVpwK36gC9",
    hex: "83581c22fb739e75d1f34748c2f03365ac909aff4d5a47bad7b4231c62a949a101581e581c2374b70ae27c8cc324be7b97285bdde6eeb78354cf6d1110baa37da000",
  },
  {
    text: "addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x",
    hex: "019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
  },
  {
    text: "addr1z8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gten0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgs9yc0hh",
    hex: "11c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251",
  },
  {
    text: "addr1yx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerkr0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shs2z78ve",
    hex: "219493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8ec37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
  },
  {
    text: "addr1x8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gt7r0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shskhj42g",
    hex: "31c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542fc37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
  },
  {
    text: "addr1gx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrzqf96k",
    hex: "419493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e8198bd431b03",
  },
  {
    text: "addr128phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtupnz75xxcrtw79hu",
    hex: "51c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f8198bd431b03",
  },
  {
    text: "addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8",
    hex: "619493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e",
  },
  {
    text: "addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx",
    hex: "71c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f",
  },
])("ada address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeAdaAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeAdaAddress(text)).toEqual(hexToBytes(hex));
  });
});
