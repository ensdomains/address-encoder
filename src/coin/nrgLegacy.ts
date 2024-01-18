import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "nrgLegacy";
const coinType = 9797;

export const encodeNrgLegacyAddress = createHexChecksummedEncoder();
export const decodeNrgLegacyAddress = createHexChecksummedDecoder();

export const nrgLegacy = {
  name,
  coinType,
  encode: encodeNrgLegacyAddress,
  decode: decodeNrgLegacyAddress,
} as const satisfies CheckedCoin;
