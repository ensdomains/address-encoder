import { expect, test } from "bun:test";
import { getCoderByCoinName, getCoderByCoinType } from "./index";

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
