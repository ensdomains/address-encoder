import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "gno";
const evmChainId = 100;
const coinType = 2147483748;

export const encodeGnoAddress = createHexChecksummedEncoder();
export const decodeGnoAddress = createHexChecksummedDecoder();

export const gno = {
  name,
  coinType,
  evmChainId,
  encode: encodeGnoAddress,
  decode: decodeGnoAddress,
} as const satisfies Coin;
