import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "dgb";
const coinType = 20;

const hrp = "dgb";
const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x3f])];

export const encodeDgbAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeDgbAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const dgb = {
  name,
  coinType,
  encode: encodeDgbAddress,
  decode: decodeDgbAddress,
} as const satisfies CheckedCoin;
