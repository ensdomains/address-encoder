import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "etc";
const evmChainId = 61;
const coinType = 2147483709;

export const encodeEtcAddress = createHexChecksummedEncoder();
export const decodeEtcAddress = createHexChecksummedDecoder();

export const etc = {
  name,
  coinType,
  evmChainId,
  encode: encodeEtcAddress,
  decode: decodeEtcAddress,
} as const satisfies Coin;
