import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "etcLegacy";
const coinType = 61;

export const encodeEtcLegacyAddress = createHexChecksummedEncoder();
export const decodeEtcLegacyAddress = createHexChecksummedDecoder();

export const etcLegacy = {
  name,
  coinType,
  encode: encodeEtcLegacyAddress,
  decode: decodeEtcLegacyAddress,
} as const satisfies CheckedCoin;
