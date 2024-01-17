import { expect, test } from "bun:test";
import { getCoderByCoinNameAsync, getCoderByCoinTypeAsync } from "./async.js";

test("coin name", async () => {
  const coder = await getCoderByCoinNameAsync("btc");
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
});

test("coin type", async () => {
  const coder = await getCoderByCoinTypeAsync(0);
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
});

test("evm coin name", async () => {
  const coder = await getCoderByCoinNameAsync("op");
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
});

test("evm coin type", async () => {
  const coder = await getCoderByCoinTypeAsync(2147483658);
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
});
