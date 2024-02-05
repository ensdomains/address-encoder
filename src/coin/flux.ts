import type { CheckedCoin } from "../types.js";
import { createZcashDecoder, createZcashEncoder } from "../utils/zcash.js";

const name = "flux";
const coinType = 19167;

const hrp = "za";
const p2pkhVersions = [new Uint8Array([0x1c, 0xb8])];
const p2shVersions = [new Uint8Array([0x1c, 0xbd])];

export const encodeFluxAddress = createZcashEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeFluxAddress = createZcashDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const flux = {
  name,
  coinType,
  encode: encodeFluxAddress,
  decode: decodeFluxAddress,
} as const satisfies CheckedCoin;
