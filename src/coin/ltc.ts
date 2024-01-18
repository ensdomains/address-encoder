import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "ltc";
const coinType = 2;

const hrp = "ltc";
const p2pkhVersions = [new Uint8Array([0x30])];
const p2shVersions = [new Uint8Array([0x32]), new Uint8Array([0x05])];

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
} as const satisfies CheckedCoin;
