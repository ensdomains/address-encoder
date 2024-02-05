import { describe, expect, test } from "bun:test";
import { validateNearAddress } from "./near.js";

describe("validateNearAddress", () => {
  test("root name", () => {
    expect(validateNearAddress("near")).toBeTrue();
  });
  test("2ld", () => {
    expect(validateNearAddress("alice.near")).toBeTrue();
  });
  test("3ld", () => {
    expect(validateNearAddress("alice.bob.near")).toBeTrue();
  });
  test("64 char account id", () => {
    expect(validateNearAddress("a".repeat(64))).toBeTrue();
  });
  test("larger than 64 chars", () => {
    expect(validateNearAddress("a".repeat(65))).toBeFalse();
  });
  test("smaller than 2 chars", () => {
    expect(validateNearAddress("a")).toBeFalse();
  });
  test("non alphanumeric", () => {
    expect(validateNearAddress("ƒelicia.near")).toBeFalse();
  });
  describe.each([".", "-", "_"])("separator", (separator) => {
    test(`starting separator: ${separator}`, () => {
      expect(validateNearAddress(`${separator}near`)).toBeFalse();
    });
    test(`ending separator: ${separator}`, () => {
      expect(validateNearAddress(`near${separator}`)).toBeFalse();
    });
    test(`consecutive separators: ${separator}`, () => {
      expect(
        validateNearAddress(`alice${separator}${separator}near`)
      ).toBeFalse();
    });
  });
});
