import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "tomoLegacy";
const coinType = 889;

export const encodeTomoLegacyAddress = createHexChecksummedEncoder();
export const decodeTomoLegacyAddress = createHexChecksummedDecoder();

export const tomoLegacy = {
  name,
  coinType,
  encode: encodeTomoLegacyAddress,
  decode: decodeTomoLegacyAddress,
} as const satisfies Coin;
