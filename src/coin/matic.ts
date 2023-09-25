import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "matic";
const evmChainId = 137;
const coinType = 2147483785;

export const encodeMaticAddress = createHexChecksummedEncoder();
export const decodeMaticAddress = createHexChecksummedDecoder();

export const matic = {
  name,
  coinType,
  evmChainId,
  encode: encodeMaticAddress,
  decode: decodeMaticAddress,
} as const satisfies Coin;
