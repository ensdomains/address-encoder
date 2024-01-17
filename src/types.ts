import type { Lt, Subtract } from "ts-arithmetic";
import * as formats from "./coins.js";
import { coinNameToTypeMap } from "./consts/coinTypeMap.js";
import type { SLIP44_MSB } from "./utils/evm.js";

export type Formats = typeof formats;

export type CoinNameToTypeMap = typeof coinNameToTypeMap;
export type CoinTypeToNameMap = {
  [key in keyof CoinNameToTypeMap as CoinNameToTypeMap[key]]: key;
};

export type CoinName = keyof CoinNameToTypeMap;
export type CoinType = CoinNameToTypeMap[CoinName];
type NonEvmCoinTypeToFormat = {
  [key in keyof Formats as Formats[key]["coinType"]]: Formats[key];
};
export type CoinTypeToFormatMap = {
  [key in CoinType]: key extends EvmCoinType
    ? Prettify<GetEvmCoin<CoinTypeToNameMap[key]>>
    : key extends keyof NonEvmCoinTypeToFormat
    ? NonEvmCoinTypeToFormat[key]
    : never;
};
export type CoinNameToFormatMap = {
  [key in CoinName]: CoinTypeToFormatMap[CoinNameToTypeMap[key]];
};

type EvmCoinMap = {
  [key in CoinName as Lt<CoinNameToTypeMap[key], typeof SLIP44_MSB> extends 0
    ? key
    : never]: CoinNameToTypeMap[key];
};
export type EvmCoinName = keyof EvmCoinMap;
export type EvmCoinType = EvmCoinMap[EvmCoinName];
export type EvmChainId = Subtract<EvmCoinType, typeof SLIP44_MSB>;

export type GetEvmCoin<
  TEvmName extends EvmCoinName,
  TCoinType extends CoinNameToTypeMap[TEvmName] = CoinNameToTypeMap[TEvmName]
> = {
  name: TEvmName;
  coinType: TCoinType;
  evmChainId: Subtract<TCoinType, typeof SLIP44_MSB>;
  encode: EncoderFunction;
  decode: DecoderFunction;
};

export type EncoderFunction = (source: Uint8Array) => string;
export type DecoderFunction = (source: string) => Uint8Array;

export type CoinParameters = {
  name: string;
  coinType: number;
  evmChainId?: number;
};

export type CoinCoder = {
  encode: EncoderFunction;
  decode: DecoderFunction;
};

export type Coin = CoinParameters & CoinCoder;

export type GetCoderByCoinName<TCoinName extends CoinName | string> =
  TCoinName extends CoinName ? CoinNameToFormatMap[TCoinName] : Coin;

export type GetCoderByCoinType<TCoinType extends CoinType | number> =
  TCoinType extends CoinType ? CoinTypeToFormatMap[TCoinType] : Coin;

export type ParseInt<T> = T extends `${infer N extends number}` ? N : never;

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
