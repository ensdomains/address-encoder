import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "go";
const evmChainId = 60;
const coinType = 2147483708;

export const encodeGoAddress = createHexChecksummedEncoder();
export const decodeGoAddress = createHexChecksummedDecoder();

export const go = {
  name,
  coinType,
  evmChainId,
  encode: encodeGoAddress,
  decode: decodeGoAddress,
} as const satisfies Coin;
