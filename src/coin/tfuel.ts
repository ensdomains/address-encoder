import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "tfuel";
const coinType = 589;

export const encodeTfuelAddress = createHexChecksummedEncoder();
export const decodeTfuelAddress = createHexChecksummedDecoder();

export const tfuel = {
  name,
  coinType,
  encode: encodeTfuelAddress,
  decode: decodeTfuelAddress,
} as const satisfies CheckedCoin;
