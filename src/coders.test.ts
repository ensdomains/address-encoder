import { expect, test } from "bun:test";
import * as coders from "./coders.js";
import { nonEvmCoinNameToTypeMap } from "./consts/coinNameToTypeMap.js";

const coinNames = Object.keys(nonEvmCoinNameToTypeMap);

const capitalise = (s: string) => s[0].toUpperCase() + s.slice(1);

test.each(coinNames)("coders.ts exports - %s", (coinName) => {
  const coderSuffix = `${capitalise(coinName)}Address`;
  const encoder = coders[`encode${coderSuffix}`];
  const decoder = coders[`decode${coderSuffix}`];
  expect(encoder).toBeFunction();
  expect(decoder).toBeFunction();
});
