import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "ewtLegacy";
const coinType = 246;

export const encodeEwtLegacyAddress = createHexChecksummedEncoder();
export const decodeEwtLegacyAddress = createHexChecksummedDecoder();

export const ewtLegacy = {
  name,
  coinType,
  encode: encodeEwtLegacyAddress,
  decode: decodeEwtLegacyAddress,
} as const satisfies CheckedCoin;
