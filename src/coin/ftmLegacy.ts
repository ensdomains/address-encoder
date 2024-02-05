import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "ftmLegacy";
const coinType = 1007;

export const encodeFtmLegacyAddress = createHexChecksummedEncoder();
export const decodeFtmLegacyAddress = createHexChecksummedDecoder();

export const ftmLegacy = {
  name,
  coinType,
  encode: encodeFtmLegacyAddress,
  decode: decodeFtmLegacyAddress,
} as const satisfies CheckedCoin;
