import { coinTypeMap } from "./consts/coinTypeMap.js";
import type {
  Coin,
  CoinName,
  CoinType,
  CoinTypeInvertedReference,
  Formats,
} from "./types.js";

export const getCoderByCoinNameAsync = async <
  TCoinName extends CoinName | string = string
>(
  name: TCoinName
): Promise<TCoinName extends CoinName ? Formats[TCoinName] : Coin> => {
  const mod = await import(`./coin/${name}`);
  if (!mod) {
    throw new Error(`Unsupported coin: ${name}`);
  }
  return mod[name];
};

export const getCoderByCoinTypeAsync = async <
  TCoinType extends CoinType | number = number
>(
  coinType: TCoinType
): Promise<
  TCoinType extends CoinType ? CoinTypeInvertedReference[TCoinType] : Coin
> => {
  const name = coinTypeMap[String(coinType) as keyof typeof coinTypeMap];
  if (!name) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  const mod = await import(`./coin/${name}`);
  if (!mod) {
    throw new Error(`Unsupported coin: ${name}`);
  }
  return mod[name];
};
