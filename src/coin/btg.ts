import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "btg";
const coinType = 156;

const hrp = "btg";
const p2pkhVersions = [new Uint8Array([0x26])];
const p2shVersions = [new Uint8Array([0x17])];

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
} as const satisfies CheckedCoin;
