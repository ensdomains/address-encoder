import * as formats from "./coins.js";

export type Formats = typeof formats;

export type CoinName = keyof Formats;
export type CoinType = Formats[CoinName]["coinType"];
export type CoinTypeInvertedReference = {
  [key in CoinName as Formats[key]["coinType"]]: Formats[key];
};

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
