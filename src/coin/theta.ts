import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "theta";
const evmChainId = 361;
const coinType = 2147484009;

export const encodeThetaAddress = createHexChecksummedEncoder();
export const decodeThetaAddress = createHexChecksummedDecoder();

export const theta = {
  name,
  coinType,
  evmChainId,
  encode: encodeThetaAddress,
  decode: decodeThetaAddress,
} as const satisfies Coin;
