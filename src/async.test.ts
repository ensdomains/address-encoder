import { expect, test } from "bun:test";
import { getCoderByCoinNameAsync, getCoderByCoinTypeAsync } from "./async.js";
import {
  evmCoinNameToTypeMap,
  nonEvmCoinNameToTypeMap,
} from "./consts/coinNameToTypeMap.js";
import {
  evmCoinTypeToNameMap,
  nonEvmCoinTypeToNameMap,
} from "./consts/coinTypeToNameMap.js";
import { coinTypeToEvmChainId } from "./utils/evm.js";

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

const nonEvmCoinNames = Object.keys(nonEvmCoinNameToTypeMap);
const evmCoinNames = Object.keys(evmCoinNameToTypeMap);

test.each(nonEvmCoinNames)(
  'getCoderByCoinNameAsync("%s")',
  async (coinName) => {
    const coder = await getCoderByCoinNameAsync(coinName);
    expect(coder.name).toBe(coinName);
    expect(coder.coinType).toBe(nonEvmCoinNameToTypeMap[coinName]);
    expect(coder.encode).toBeFunction();
    expect(coder.decode).toBeFunction();
  }
);

test.each(evmCoinNames)('getCoderByCoinNameAsync("%s")', async (coinName) => {
  const coder = await getCoderByCoinNameAsync(coinName);
  expect(coder.name).toBe(coinName);
  expect(coder.coinType).toBe(evmCoinNameToTypeMap[coinName]);
  expect(coder.evmChainId).toBe(coinTypeToEvmChainId(coder.coinType));
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

const nonEvmCoinTypes = Object.values(nonEvmCoinNameToTypeMap);
const evmCoinTypes = Object.values(evmCoinNameToTypeMap);

test.each(nonEvmCoinTypes)("getCoderByCoinTypeAsync(%d)", async (coinType) => {
  const coder = await getCoderByCoinTypeAsync(coinType);
  expect(coder.name).toBe(nonEvmCoinTypeToNameMap[coinType][0]);
  expect(coder.coinType).toBe(coinType);
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test.each(evmCoinTypes)("getCoderByCoinTypeAsync(%d)", async (coinType) => {
  const coder = await getCoderByCoinTypeAsync(coinType);
  expect(coder.name).toBe(evmCoinTypeToNameMap[coinType][0]);
  expect(coder.coinType).toBe(coinType);
  expect(coder.evmChainId).toBe(coinTypeToEvmChainId(coinType));
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});
