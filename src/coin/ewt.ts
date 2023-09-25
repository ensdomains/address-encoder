import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "ewt";
const evmChainId = 246;
const coinType = 2147483894;

export const encodeEwtAddress = createHexChecksummedEncoder();
export const decodeEwtAddress = createHexChecksummedDecoder();

export const ewt = {
  name,
  coinType,
  evmChainId,
  encode: encodeEwtAddress,
  decode: decodeEwtAddress,
} as const satisfies Coin;
