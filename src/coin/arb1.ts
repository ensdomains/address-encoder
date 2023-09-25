import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "arb1";
const evmChainId = 42161;
const coinType = 2147525809;

export const encodeArb1Address = createHexChecksummedEncoder();
export const decodeArb1Address = createHexChecksummedDecoder();

export const arb1 = {
  name,
  coinType,
  evmChainId,
  encode: encodeArb1Address,
  decode: decodeArb1Address,
} as const satisfies Coin;
