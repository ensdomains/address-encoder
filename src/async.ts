import type * as formats from "./coins";
import { coinTypeMap } from "./consts/coinTypeMap";

type Formats = typeof formats;

type CoinName = keyof Formats;
type CoinType = Formats[CoinName]["coinType"];
type CoinTypeInvertedReference = {
  [key in CoinName as Formats[key]["coinType"]]: Formats[key];
};

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
