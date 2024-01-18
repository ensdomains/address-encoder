import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "ccxx";
const coinType = 571;

const hrp = "ccx";
const p2pkhVersions = [new Uint8Array([0x89])];
const p2shVersions = [new Uint8Array([0x4b]), new Uint8Array([0x05])];

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
} as const satisfies CheckedCoin;
