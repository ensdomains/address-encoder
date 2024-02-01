import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "bcd";
const coinType = 999;

const hrp = "bcd";
const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];

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
} as const satisfies CheckedCoin;
