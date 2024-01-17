import { expect, test } from "bun:test";
import { getCoderByCoinName, getCoderByCoinType } from "./index.js";

test("coin name", () => {
  const coder = getCoderByCoinName("btc");
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
});

test("coin type", () => {
  const coder = getCoderByCoinType(0);
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
});

test("evm coin name", () => {
  const coder = getCoderByCoinName("op");
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
});

test("evm coin type", () => {
  const coder = getCoderByCoinType(2147483658);
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
});
