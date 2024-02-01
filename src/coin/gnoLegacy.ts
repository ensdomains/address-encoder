import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "gnoLegacy";
const coinType = 700;

export const encodeGnoLegacyAddress = createHexChecksummedEncoder();
export const decodeGnoLegacyAddress = createHexChecksummedDecoder();

export const gnoLegacy = {
  name,
  coinType,
  encode: encodeGnoLegacyAddress,
  decode: decodeGnoLegacyAddress,
} as const satisfies CheckedCoin;
