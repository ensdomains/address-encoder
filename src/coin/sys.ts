import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "SYS";
const coinType = 57;
const hrp = "sys";

const p2pkhVersions = [[0x3f]];
const p2shVersions = [[0x05]];

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
} satisfies Coin;
