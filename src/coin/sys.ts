import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "sys";
const coinType = 57;

const hrp = "sys";
const p2pkhVersions = [new Uint8Array([0x3f])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeSysAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeSysAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const sys = {
  name,
  coinType,
  encode: encodeSysAddress,
  decode: decodeSysAddress,
} as const satisfies CheckedCoin;
