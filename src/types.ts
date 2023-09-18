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
