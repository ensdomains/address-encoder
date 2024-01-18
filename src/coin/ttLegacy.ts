import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "ttLegacy";
const coinType = 1001;

export const encodeTtLegacyAddress = createHexChecksummedEncoder();
export const decodeTtLegacyAddress = createHexChecksummedDecoder();

export const ttLegacy = {
  name,
  coinType,
  encode: encodeTtLegacyAddress,
  decode: decodeTtLegacyAddress,
} as const satisfies CheckedCoin;
