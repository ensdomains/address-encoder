import * as formats from "./coins.js";
import { coinTypeMap } from "./consts/coinTypeMap.js";
import type {
  CoinName,
  CoinType,
  CoinTypeInvertedReference,
  Formats,
} from "./types.js";

export const getCoderByCoinName = <TCoinName extends CoinName>(
  name: TCoinName
): Formats[TCoinName] => {
  const format = formats[name];
  if (!format) {
    throw new Error(`Unsupported coin: ${name}`);
  }
  return format;
};

export const getCoderByCoinType = <TCoinType extends CoinType>(
  coinType: TCoinType
): CoinTypeInvertedReference[TCoinType] => {
  const name = coinTypeMap[String(coinType) as keyof typeof coinTypeMap];
  if (!name) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  const format = formats[name] as CoinTypeInvertedReference[TCoinType];
  if (!format) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  return format;
};
