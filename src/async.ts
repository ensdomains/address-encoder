import { coinTypeMap } from "./consts/coinTypeMap.js";
import type {
  CoinName,
  CoinType,
  CoinTypeInvertedReference,
  Formats,
} from "./types.js";

export const getCoderByCoinNameAsync = async <TCoinName extends CoinName>(
  name: TCoinName
): Promise<Formats[TCoinName]> => {
  const mod = await import(`./coin/${name}`);
  if (!mod) {
    throw new Error(`Unsupported coin: ${name}`);
  }
  return mod[name];
};

export const getCoderByCoinTypeAsync = async <TCoinType extends CoinType>(
  coinType: TCoinType
): Promise<CoinTypeInvertedReference[TCoinType]> => {
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
