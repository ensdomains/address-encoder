import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "vet";
const coinType = 703;

export const encodeVetAddress = createHexChecksummedEncoder();
export const decodeVetAddress = createHexChecksummedDecoder();

export const vet = {
  name,
  coinType,
  encode: encodeVetAddress,
  decode: decodeVetAddress,
} as const satisfies Coin;
