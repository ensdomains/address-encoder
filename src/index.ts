import * as formats from "./coins.js";
import {
  coinNameToTypeMap,
  evmCoinNameToTypeMap,
  nonEvmCoinNameToTypeMap,
} from "./consts/coinNameToTypeMap.js";
import {
  coinTypeToNameMap,
  evmCoinTypeToNameMap,
  nonEvmCoinTypeToNameMap,
} from "./consts/coinTypeToNameMap.js";
import type {
  Coin,
  CoinName,
  CoinType,
  DecoderFunction,
  EncoderFunction,
  EvmCoinName,
  EvmCoinType,
  GetCoderByCoinName,
  GetCoderByCoinType,
} from "./types.js";
import { SLIP44_MSB, coinTypeToEvmChainId } from "./utils/evm.js";

export type {
  Coin,
  CoinName,
  CoinType,
  DecoderFunction,
  EncoderFunction,
  EvmCoinName,
  EvmCoinType,
};

export {
  coinNameToTypeMap,
  coinTypeToNameMap,
  evmCoinNameToTypeMap,
  evmCoinTypeToNameMap,
  nonEvmCoinNameToTypeMap,
  nonEvmCoinTypeToNameMap,
};

export const getCoderByCoinName = <
  TCoinName extends CoinName | string = CoinName | string
>(
  name: TCoinName
): GetCoderByCoinName<TCoinName> => {
  const format = formats[name as keyof typeof formats];
  if (!format) {
    // EVM coin
    const coinType = coinNameToTypeMap[name as EvmCoinName];
    if (!coinType) throw new Error(`Unsupported coin: ${name}`);

    const evmChainId = coinTypeToEvmChainId(coinType);
    const ethFormat = formats["eth"];
    return {
      name: name as EvmCoinName,
      coinType,
      evmChainId,
      encode: ethFormat.encode,
      decode: ethFormat.decode,
    } as GetCoderByCoinName<TCoinName>;
  }
  return format as GetCoderByCoinName<TCoinName>;
};

export const getCoderByCoinType = <
  TCoinType extends CoinType | number = CoinType | number
>(
  coinType: TCoinType
): GetCoderByCoinType<TCoinType> => {
  const names =
    coinTypeToNameMap[String(coinType) as keyof typeof coinTypeToNameMap];
  // https://docs.ens.domains/ens-improvement-proposals/ensip-11-evmchain-address-resolution

  if (coinType >= SLIP44_MSB) {
    // EVM coin
    const evmChainId = coinTypeToEvmChainId(coinType);
    const isUnknownChain = !names;
    const name = isUnknownChain ? `Unknown Chain (${evmChainId})` : names[0]; // name is derivable
    const ethFormat = formats["eth"];
    return {
      name,
      coinType: coinType as EvmCoinType,
      evmChainId,
      isUnknownChain,
      encode: ethFormat.encode,
      decode: ethFormat.decode,
    } as GetCoderByCoinType<TCoinType>;
  }

  if (!names) {
    throw new Error(`Unsupported coin type: ${coinType}`);
  }
  const [name] = names;
  const format = formats[name as keyof typeof formats];
  return format as GetCoderByCoinType<TCoinType>;
};
