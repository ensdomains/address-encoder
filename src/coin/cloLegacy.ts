import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "cloLegacy";
const coinType = 820;

export const encodeCloLegacyAddress = createHexChecksummedEncoder();
export const decodeCloLegacyAddress = createHexChecksummedDecoder();

export const cloLegacy = {
  name,
  coinType,
  encode: encodeCloLegacyAddress,
  decode: decodeCloLegacyAddress,
} as const satisfies CheckedCoin;
