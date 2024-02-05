import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "lcc";
const coinType = 192;

const hrp = "lcc";
const p2pkhVersions = [new Uint8Array([0x1c])];
const p2shVersions = [new Uint8Array([0x32]), new Uint8Array([0x05])];

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
} as const satisfies CheckedCoin;
