import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "cro";
const evmChainId = 25;
const coinType = 2147483673;

export const encodeCroAddress = createHexChecksummedEncoder();
export const decodeCroAddress = createHexChecksummedDecoder();

export const cro = {
  name,
  coinType,
  evmChainId,
  encode: encodeCroAddress,
  decode: decodeCroAddress,
} as const satisfies Coin;
