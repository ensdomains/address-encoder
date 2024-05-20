import { describe, expect, test } from "bun:test";
import { isValidChecksumAddress } from "./hex.js";

const prefixlessAddress = "314159265dD8dbb310642f98f50C066173C1259b";

describe("isValidChecksumAddress()", () => {
  test("valid checksum address", () => {
    expect(isValidChecksumAddress(`0x${prefixlessAddress}`)).toBeTrue();
  });
  test("all lowercased address", () => {
    expect(
      isValidChecksumAddress(`0x${prefixlessAddress.toLowerCase()}`)
    ).toBeTrue();
  });
  test("all uppercased address", () => {
    expect(
      isValidChecksumAddress(`0x${prefixlessAddress.toUpperCase()}`)
    ).toBeTrue();
  });
  test("invalid checksum address", () => {
    expect(
      isValidChecksumAddress("0x314159265Dd8Dbb310642f98F50C066173C1259b")
    ).toBeFalse();
  });
  test("non-hex", () => {
    expect(
      isValidChecksumAddress("0x1234567890abcdefghijklmnopqrstuvwxyz0123")
    ).toBeFalse();
  });
});
