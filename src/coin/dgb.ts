import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "DGB";
const coinType = 20;

const hrp = "dgb";
const p2pkhVersions = [[0x1e]];
const p2shVersions = [[0x3f]];

export const encodeDgbAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeDgbAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const dgb = {
  name,
  coinType,
  encode: encodeDgbAddress,
  decode: decodeDgbAddress,
} as const satisfies Coin;
