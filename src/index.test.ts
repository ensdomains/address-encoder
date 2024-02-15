import { expect, test } from "bun:test";
import {
  evmCoinNameToTypeMap,
  nonEvmCoinNameToTypeMap,
} from "./consts/coinNameToTypeMap.js";
import {
  evmCoinTypeToNameMap,
  nonEvmCoinTypeToNameMap,
} from "./consts/coinTypeToNameMap.js";
import { getCoderByCoinName, getCoderByCoinType } from "./index.js";
import { coinTypeToEvmChainId } from "./utils/evm.js";

test("coin name", () => {
  const coder = getCoderByCoinName("btc");
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test("coin type", () => {
  const coder = getCoderByCoinType(0);
  expect(coder.coinType).toBe(0);
  expect(coder.name).toBe("btc");
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test("evm coin name", () => {
  const coder = getCoderByCoinName("op");
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test("evm coin type", () => {
  const coder = getCoderByCoinType(2147483658);
  expect(coder.coinType).toBe(2147483658);
  expect(coder.name).toBe("op");
  expect(coder.evmChainId).toBe(10);
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test("unknown evm coin type", () => {
  const coder = getCoderByCoinType(2147483659);
  expect(coder.coinType).toBe(2147483659);
  expect(coder.name).toBe("Unknown Chain (11)");
  expect(coder.evmChainId).toBe(11);
  expect(coder.isUnknownChain).toBeTrue();
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

const nonEvmCoinNames = Object.keys(nonEvmCoinNameToTypeMap);
const evmCoinNames = Object.keys(evmCoinNameToTypeMap);

test.each(nonEvmCoinNames)('getCoderByCoinName("%s")', (coinName) => {
  const coder = getCoderByCoinName(coinName);
  expect(coder.name).toBe(coinName);
  expect(coder.coinType).toBe(nonEvmCoinNameToTypeMap[coinName]);
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test.each(evmCoinNames)('getCoderByCoinName("%s")', (coinName) => {
  const coder = getCoderByCoinName(coinName);
  expect(coder.name).toBe(coinName);
  expect(coder.coinType).toBe(evmCoinNameToTypeMap[coinName]);
  expect(coder.evmChainId).toBe(coinTypeToEvmChainId(coder.coinType));
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

const nonEvmCoinTypes = Object.values(nonEvmCoinNameToTypeMap);
const evmCoinTypes = Object.values(evmCoinNameToTypeMap);

test.each(nonEvmCoinTypes)("getCoderByCoinType(%d)", (coinType) => {
  const coder = getCoderByCoinType(coinType);
  expect(coder.name).toBe(nonEvmCoinTypeToNameMap[coinType][0]);
  expect(coder.coinType).toBe(coinType);
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});

test.each(evmCoinTypes)("getCoderByCoinType(%d)", (coinType) => {
  const coder = getCoderByCoinType(coinType);
  expect(coder.name).toBe(evmCoinTypeToNameMap[coinType][0]);
  expect(coder.coinType).toBe(coinType);
  expect(coder.evmChainId).toBe(coinTypeToEvmChainId(coinType));
  expect(coder.encode).toBeFunction();
  expect(coder.decode).toBeFunction();
});
