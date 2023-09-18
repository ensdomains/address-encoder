import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "BCD";
const coinType = 999;

const hrp = "bcd";
const p2pkhVersions = [[0x00]];
const p2shVersions = [[0x05]];

export const encodeBcdAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeBcdAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const bcd = {
  name,
  coinType,
  encode: encodeBcdAddress,
  decode: decodeBcdAddress,
} as const satisfies Coin;
