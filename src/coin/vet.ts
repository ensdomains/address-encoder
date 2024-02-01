import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "vet";
const coinType = 818;

export const encodeVetAddress = createHexChecksummedEncoder();
export const decodeVetAddress = createHexChecksummedDecoder();

export const vet = {
  name,
  coinType,
  encode: encodeVetAddress,
  decode: decodeVetAddress,
} as const satisfies CheckedCoin;
