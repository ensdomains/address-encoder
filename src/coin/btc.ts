import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "BTC";
const coinType = 0;

const hrp = "bc";
const p2pkhVersions = [[0x00]];
const p2shVersions = [[0x05]];

export const encodeBtcAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeBtcAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const btc = {
  name,
  coinType,
  encode: encodeBtcAddress,
  decode: decodeBtcAddress,
} as const satisfies Coin;
