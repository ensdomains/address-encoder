import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "celoLegacy";
const coinType = 52752;

export const encodeCeloLegacyAddress = createHexChecksummedEncoder();
export const decodeCeloLegacyAddress = createHexChecksummedDecoder();

export const celoLegacy = {
  name,
  coinType,
  encode: encodeCeloLegacyAddress,
  decode: decodeCeloLegacyAddress,
} as const satisfies CheckedCoin;
