import type { CheckedCoin } from "../types.js";
import { createZcashDecoder, createZcashEncoder } from "../utils/zcash.js";

const name = "zec";
const coinType = 133;

const hrp = "zs";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];

export const encodeZecAddress = createZcashEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeZecAddress = createZcashDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const zec = {
  name,
  coinType,
  encode: encodeZecAddress,
  decode: decodeZecAddress,
} as const satisfies CheckedCoin;
