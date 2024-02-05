import { base64urlnopad } from "@scure/base";
import type { CheckedCoin } from "../types.js";

const name = "ar";
const coinType = 472;

export const encodeArAddress = base64urlnopad.encode;
export const decodeArAddress = base64urlnopad.decode;

export const ar = {
  name,
  coinType,
  encode: encodeArAddress,
  decode: decodeArAddress,
} as const satisfies CheckedCoin;
