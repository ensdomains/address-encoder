import * as formats from "./coins.js";
import { coinTypeMap } from "./consts/coinTypeMap.js";
import type {
  Coin,
  CoinName,
  CoinType,
  CoinTypeInvertedReference,
  DecoderFunction,
  EncoderFunction,
  Formats,
} from "./types.js";

export type {
  Coin,
  CoinName,
  CoinType,
  CoinTypeInvertedReference,
  DecoderFunction,
  EncoderFunction,
  Formats,
};

export const getCoderByCoinName = <
  TCoinName extends CoinName | string = string
>(
  name: TCoinName
): TCoinName extends CoinName ? Formats[TCoinName] : Coin => {
  const format = formats[name as keyof typeof formats];
  if (!format) {
    throw new Error(`Unsupported coin: ${name}`);
  }
  return format as TCoinName extends CoinName ? Formats[TCoinName] : Coin;
};

export const getCoderByCoinType = <
  TCoinType extends CoinType | number = number
>(
  coinType: TCoinType
): TCoinType extends CoinType ? CoinTypeInvertedReference[TCoinType] : Coin => {
  const name = coinTypeMap[String(coinType) as keyof typeof coinTypeMap];
  if (!name) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  const format = formats[name];
  if (!format) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  return format as TCoinType extends CoinType
    ? CoinTypeInvertedReference[TCoinType]
    : Coin;
};
