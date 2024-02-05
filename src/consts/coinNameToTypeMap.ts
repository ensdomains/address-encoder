import type { ParseInt } from "../types.js";
import {
  evmCoinTypeToNameMap,
  nonEvmCoinTypeToNameMap,
} from "./coinTypeToNameMap.js";

export const evmCoinNameToTypeMap = Object.freeze(
  Object.fromEntries(
    Object.entries(evmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])
  ) as {
    readonly [key in keyof typeof evmCoinTypeToNameMap as (typeof evmCoinTypeToNameMap)[key][0]]: ParseInt<key>;
  }
);

export const nonEvmCoinNameToTypeMap = Object.freeze(
  Object.fromEntries(
    Object.entries(nonEvmCoinTypeToNameMap).map(([k, [v]]) => [v, parseInt(k)])
  ) as {
    readonly [key in keyof typeof nonEvmCoinTypeToNameMap as (typeof nonEvmCoinTypeToNameMap)[key][0]]: ParseInt<key>;
  }
);

export const coinNameToTypeMap = Object.freeze({
  ...evmCoinNameToTypeMap,
  ...nonEvmCoinNameToTypeMap,
} as const);
