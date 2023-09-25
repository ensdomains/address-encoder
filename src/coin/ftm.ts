import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "ftm";
const evmChainId = 250;
const coinType = 2147483898;

export const encodeFtmAddress = createHexChecksummedEncoder();
export const decodeFtmAddress = createHexChecksummedDecoder();

export const ftm = {
  name,
  coinType,
  evmChainId,
  encode: encodeFtmAddress,
  decode: decodeFtmAddress,
} as const satisfies Coin;
