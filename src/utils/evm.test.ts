import { describe, expect, test } from "bun:test";
import {
  coinTypeToEvmChainId,
  evmChainIdToCoinType,
  isEvmCoinType,
} from "./evm.js";

describe("isEvmCoinType()", () => {
  test("non evm coin type", () => {
    expect(isEvmCoinType(1000)).toBeFalse();
  });
  test("evm coin type", () => {
    expect(isEvmCoinType(2147483658)).toBeTrue();
  });
});

describe("evmChainIdToCoinType()", () => {
  test("normal chainId", () => {
    expect(evmChainIdToCoinType(10)).toBe(2147483658);
  });
  test("chainId too large", () => {
    expect(() => evmChainIdToCoinType(2147483648)).toThrow("Invalid chainId");
  });
});

describe("coinTypeToEvmChainId()", () => {
  test("non evm coin type", () => {
    expect(() => coinTypeToEvmChainId(1000)).toThrow(
      "Coin type is not an EVM chain"
    );
  });
  test("evm coin type", () => {
    expect(coinTypeToEvmChainId(2147483658)).toBe(10);
  });
});
