import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "clo";
const evmChainId = 820;
const coinType = 2147484468;

export const encodeCloAddress = createHexChecksummedEncoder();
export const decodeCloAddress = createHexChecksummedDecoder();

export const clo = {
  name,
  coinType,
  evmChainId,
  encode: encodeCloAddress,
  decode: decodeCloAddress,
} as const satisfies Coin;
