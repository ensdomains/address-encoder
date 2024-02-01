import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "poaLegacy";
const coinType = 178;

export const encodePoaLegacyAddress = createHexChecksummedEncoder();
export const decodePoaLegacyAddress = createHexChecksummedDecoder();

export const poaLegacy = {
  name,
  coinType,
  encode: encodePoaLegacyAddress,
  decode: decodePoaLegacyAddress,
} as const satisfies CheckedCoin;
