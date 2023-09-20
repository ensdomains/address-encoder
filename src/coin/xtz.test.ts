import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXtzAddress, encodeXtzAddress } from "./xtz";

describe.each([
  {
    text: "KT1BDEn6wobs7tDReKkGheXAhoq278TGaNn5",
    hex: "011cd5f135e80fd8ebb6e43335b24ca6116edeba6900",
  },
  {
    text: "KT1BDEn6wobs7tDReKkGheXAhoq278TGaNn5",
    hex: "011cd5f135e80fd8ebb6e43335b24ca6116edeba6900",
  },
  {
    text: "tz1XdRrrqrMfsFKA8iuw53xHzug9ipr6MuHq",
    hex: "000083846eddd5d3c5ed96e962506253958649c84a74",
  },
  {
    text: "tz2Cfwk4ortcaqAGcVJKSxLiAdcFxXBLBoyY",
    hex: "00012fcb1d9307f0b1f94c048ff586c09f46614c7e90",
  },
  {
    text: "tz3NdTPb3Ax2rVW2Kq9QEdzfYFkRwhrQRPhX",
    hex: "0002193b2b3f6b8f8e1e6b39b4d442fc2b432f6427a8",
  },
])("xtz address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXtzAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXtzAddress(text)).toEqual(hexToBytes(hex));
  });
});
