import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "nrg";
const evmChainId = 39797;
const coinType = 2147523445;

export const encodeNrgAddress = createHexChecksummedEncoder();
export const decodeNrgAddress = createHexChecksummedDecoder();

export const nrg = {
  name,
  coinType,
  evmChainId,
  encode: encodeNrgAddress,
  decode: decodeNrgAddress,
} as const satisfies Coin;
