import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "CCXX";
const coinType = 571;

const hrp = "ccx";
const p2pkhVersions = [[0x89]];
const p2shVersions = [[0x4b], [0x05]];

export const encodeCcxxAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeCcxxAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const ccxx = {
  name,
  coinType,
  encode: encodeCcxxAddress,
  decode: decodeCcxxAddress,
} satisfies Coin;
