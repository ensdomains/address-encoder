import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "btc";
const coinType = 0;

const hrp = "bc";
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];

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
} as const satisfies CheckedCoin;
