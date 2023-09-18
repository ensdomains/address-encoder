import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "LTC";
const coinType = 2;

const hrp = "ltc";
const p2pkhVersions = [[0x30]];
const p2shVersions = [[0x32], [0x05]];

export const encodeLtcAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeLtcAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const ltc = {
  name,
  coinType,
  encode: encodeLtcAddress,
  decode: decodeLtcAddress,
} as const satisfies Coin;
