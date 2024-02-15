import type { Add, GtOrEq, Lt, Subtract } from "ts-arithmetic";
import type { EvmChainId, EvmCoinType } from "../types.js";

export const SLIP44_MSB = 0x80000000;

export const isEvmCoinType = <
  TCoinType extends EvmCoinType | number = EvmCoinType | number
>(
  coinType: TCoinType
) =>
  ((coinType & SLIP44_MSB) !== 0) as GtOrEq<
    TCoinType,
    typeof SLIP44_MSB
  > extends 1
    ? true
    : false;

type EvmChainIdToCoinType<
  TChainId extends EvmChainId | number = EvmChainId | number
> = Lt<TChainId, typeof SLIP44_MSB> extends 1
  ? Add<TChainId, typeof SLIP44_MSB>
  : never;

export const evmChainIdToCoinType = <
  TChainId extends EvmChainId | number = EvmChainId | number
>(
  chainId: TChainId
): EvmChainIdToCoinType<TChainId> => {
  if (chainId >= SLIP44_MSB) throw new Error("Invalid chainId");
  return ((SLIP44_MSB | chainId) >>> 0) as EvmChainIdToCoinType<TChainId>;
};

type CoinTypeToEvmChainId<
  TCoinType extends EvmCoinType | number = EvmCoinType | number
> = Lt<TCoinType, typeof SLIP44_MSB> extends 1
  ? never
  : Subtract<TCoinType, typeof SLIP44_MSB>;

export const coinTypeToEvmChainId = <
  TCoinType extends EvmCoinType | number = EvmCoinType | number
>(
  coinType: TCoinType
): CoinTypeToEvmChainId<TCoinType> => {
  if ((coinType & SLIP44_MSB) === 0)
    throw new Error("Coin type is not an EVM chain");
  return (((SLIP44_MSB - 1) & coinType) >>
    0) as CoinTypeToEvmChainId<TCoinType>;
};
