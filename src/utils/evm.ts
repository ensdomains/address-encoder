export const SLIP44_MSB = 0x80000000;

export const evmChainIdToCoinType = (chainId: number) => {
  if (chainId >= SLIP44_MSB) throw new Error("Invalid chainId");
  return (SLIP44_MSB | chainId) >>> 0;
};

export const coinTypeToEvmChainId = (coinType: number) => {
  if ((coinType & SLIP44_MSB) === 0)
    throw new Error("Coin type is not an EVM chain");
  return ((SLIP44_MSB - 1) & coinType) >> 0;
};
