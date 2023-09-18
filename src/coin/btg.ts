import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "BTG";
const coinType = 156;

const hrp = "btg";
const p2pkhVersions = [[0x26]];
const p2shVersions = [[0x17]];

export const encodeBtgAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeBtgAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const btg = {
  name,
  coinType,
  encode: encodeBtgAddress,
  decode: decodeBtgAddress,
} as const satisfies Coin;
