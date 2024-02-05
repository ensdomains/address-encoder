import type { CheckedCoin } from "../types.js";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr.js";

const name = "xhv";
const coinType = 535;

export const encodeXhvAddress = encodeXmrAddress;
export const decodeXhvAddress = decodeXmrAddress;

export const xhv = {
  name,
  coinType,
  encode: encodeXhvAddress,
  decode: decodeXhvAddress,
} as const satisfies CheckedCoin;
