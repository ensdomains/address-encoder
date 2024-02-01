import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "goLegacy";
const coinType = 6060;

export const encodeGoLegacyAddress = createHexChecksummedEncoder();
export const decodeGoLegacyAddress = createHexChecksummedDecoder();

export const goLegacy = {
  name,
  coinType,
  encode: encodeGoLegacyAddress,
  decode: decodeGoLegacyAddress,
} as const satisfies CheckedCoin;
