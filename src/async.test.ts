import { expect, test } from "bun:test";
import { getCoderByCoinNameAsync, getCoderByCoinTypeAsync } from "./async";

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
