import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "thetaLegacy";
const coinType = 500;

export const encodeThetaLegacyAddress = createHexChecksummedEncoder();
export const decodeThetaLegacyAddress = createHexChecksummedDecoder();

export const thetaLegacy = {
  name,
  coinType,
  encode: encodeThetaLegacyAddress,
  decode: decodeThetaLegacyAddress,
} as const satisfies CheckedCoin;
