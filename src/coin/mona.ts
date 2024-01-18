import type { CheckedCoin } from "../types.js";
import {
  createBitcoinDecoder,
  createBitcoinEncoder,
} from "../utils/bitcoin.js";

const name = "mona";
const coinType = 22;

const hrp = "mona";
const p2pkhVersions = [new Uint8Array([0x32])];
const p2shVersions = [new Uint8Array([0x37]), new Uint8Array([0x05])];

export const encodeMonaAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeMonaAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const mona = {
  name,
  coinType,
  encode: encodeMonaAddress,
  decode: decodeMonaAddress,
} as const satisfies CheckedCoin;
