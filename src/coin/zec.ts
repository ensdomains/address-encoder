import { Coin } from "../types";
import { createZcashDecoder, createZcashEncoder } from "../utils/zcash";

const name = "ZEC";
const coinType = 133;

const hrp = "zs";
const p2pkhVersions = [[0x1c, 0xb8]];
const p2shVersions = [[0x1c, 0xbd]];

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
} satisfies Coin;
