import { eth } from "./coins.js";
import { coinNameToTypeMap, coinTypeToNameMap } from "./consts/coinTypeMap.js";
import type {
  CoinName,
  CoinType,
  EvmCoinName,
  EvmCoinType,
  GetCoderByCoinName,
  GetCoderByCoinType,
} from "./types.js";
import { SLIP44_MSB, coinTypeToEvmChainId } from "./utils/evm.js";

export const getCoderByCoinNameAsync = async <
  TCoinName extends CoinName | string = CoinName | string
>(
  name: TCoinName
): Promise<GetCoderByCoinName<TCoinName>> => {
  const coinType = coinNameToTypeMap[name as CoinName];

  if (coinType === undefined) throw new Error(`Unsupported coin: ${name}`);

  if (coinType >= SLIP44_MSB) {
    // EVM coin
    const evmChainId = coinTypeToEvmChainId(coinType);
    return {
      name: name as EvmCoinName,
      coinType,
      evmChainId,
      encode: eth.encode,
      decode: eth.decode,
    } as GetCoderByCoinName<TCoinName>;
  }
  const mod = await import(`./coin/${name}`);

  if (!mod) throw new Error(`Failed to load coin: ${name}`);

  return mod[name];
};

export const getCoderByCoinTypeAsync = async <
  TCoinType extends CoinType | number = CoinType | number
>(
  coinType: TCoinType
): Promise<GetCoderByCoinType<TCoinType>> => {
  const name =
    coinTypeToNameMap[String(coinType) as keyof typeof coinTypeToNameMap];

  if (!name) throw new Error(`Unsupported coin type: ${coinType}`);

  if (coinType >= SLIP44_MSB) {
    // EVM coin
    const evmChainId = coinTypeToEvmChainId(coinType);
    return {
      name,
      coinType: coinType as EvmCoinType,
      evmChainId,
      encode: eth.encode,
      decode: eth.decode,
    } as GetCoderByCoinType<TCoinType>;
  }
  const mod = await import(`./coin/${name}`);

  if (!mod) throw new Error(`Failed to load coin: ${name}`);

  return mod[name];
};
