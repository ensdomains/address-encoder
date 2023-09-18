import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "LCC";
const coinType = 192;

const hrp = "lcc";
const p2pkhVersions = [[0x1c]];
const p2shVersions = [[0x32], [0x05]];

export const encodeLccAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeLccAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const lcc = {
  name,
  coinType,
  encode: encodeLccAddress,
  decode: decodeLccAddress,
} as const satisfies Coin;
