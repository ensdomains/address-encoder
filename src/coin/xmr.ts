import { base58xmr } from "@scure/base";
import type { CheckedCoin } from "../types.js";

const name = "xmr";
const coinType = 128;

export const encodeXmrAddress = base58xmr.encode;
export const decodeXmrAddress = base58xmr.decode;

export const xmr = {
  name,
  coinType,
  encode: encodeXmrAddress,
  decode: decodeXmrAddress,
} as const satisfies CheckedCoin;
