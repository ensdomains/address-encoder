import type { Coin } from "../types.js";
import { createZcashDecoder, createZcashEncoder } from "../utils/zcash.js";

const name = "zel";
const coinType = 19167;

const hrp = "za";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];

export const encodeZelAddress = createZcashEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeZelAddress = createZcashDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const zel = {
  name,
  coinType,
  encode: encodeZelAddress,
  decode: decodeZelAddress,
} as const satisfies Coin;
