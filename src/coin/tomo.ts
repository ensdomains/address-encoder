import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "tomo";
const evmChainId = 88;
const coinType = 2147483736;

export const encodeTomoAddress = createHexChecksummedEncoder();
export const decodeTomoAddress = createHexChecksummedDecoder();

export const tomo = {
  name,
  coinType,
  evmChainId,
  encode: encodeTomoAddress,
  decode: decodeTomoAddress,
} as const satisfies Coin;
