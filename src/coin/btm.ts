import type { CheckedCoin } from "../types.js";
import {
  createBech32SegwitDecoder,
  createBech32SegwitEncoder,
} from "../utils/bech32.js";

const name = "btm";
const coinType = 153;

const hrp = "bm";

export const encodeBtmAddress = createBech32SegwitEncoder(hrp);
export const decodeBtmAddress = createBech32SegwitDecoder(hrp);

export const btm = {
  name,
  coinType,
  encode: encodeBtmAddress,
  decode: decodeBtmAddress,
} as const satisfies CheckedCoin;
