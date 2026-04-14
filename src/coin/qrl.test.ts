import { describe, expect, test } from "bun:test";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import { decodeQrlAddress, encodeQrlAddress } from "./qrl.js";

const payloadHex = "0105002f1906128d5885b4d929f8ea0c177f84a89f66ec1770071cfc4f7f2d5cd0f6dd";
const checksumHex = "1b15e135";
const address = `Q${payloadHex}${checksumHex}`;
const payloadHex2 = "02070028dc6ca5f722f9646171cee25eff5d178907d0e05a7c343eeba77ef138fcc0da";
const checksumHex2 = "9a0074db";
const address2 = `Q${payloadHex2}${checksumHex2}`;

describe.each([
  { address, hex: `${payloadHex}${checksumHex}` },
  { address: address2, hex: `${payloadHex2}${checksumHex2}` },
])(
  "qrl address",
  ({ address: text, hex }) => {
    test(`encode: ${text}`, () => {
      expect(encodeQrlAddress(hexToBytes(hex))).toEqual(text);
    });
    test(`decode: ${text}`, () => {
      expect(bytesToHex(decodeQrlAddress(text))).toEqual(hex);
    });
  }
);

test("QRL decoding - invalid prefix", () => {
  expect(() => decodeQrlAddress(address.slice(1))).toThrow(
    "Unrecognised address format"
  );
});

test("QRL decoding - invalid checksum", () => {
  expect(() => decodeQrlAddress(`${address.slice(0, -1)}1`)).toThrow(
    "Unrecognised address format"
  );
});

test("QRL encoding - invalid length", () => {
  expect(() => encodeQrlAddress(hexToBytes(payloadHex))).toThrow(
    "Unrecognised address format"
  );
});

test("QRL encoding - invalid checksum with valid length", () => {
  const invalidHex = `${payloadHex}ffffffff`;
  expect(() => encodeQrlAddress(hexToBytes(invalidHex))).toThrow(
    "Unrecognised address format"
  );
});

test("QRL decoding - invalid hex character", () => {
  const invalid = `${address.slice(0, -1)}g`;
  expect(() => decodeQrlAddress(invalid)).toThrow("Unrecognised address format");
});

test("QRL decoding - uppercase hex is accepted", () => {
  const upper = `Q${`${payloadHex}${checksumHex}`.toUpperCase()}`;
  expect(bytesToHex(decodeQrlAddress(upper))).toEqual(`${payloadHex}${checksumHex}`);
});

test("QRL decoding - lowercase prefix is rejected", () => {
  const lowerPrefix = `q${address.slice(1)}`;
  expect(() => decodeQrlAddress(lowerPrefix)).toThrow(
    "Unrecognised address format"
  );
});
