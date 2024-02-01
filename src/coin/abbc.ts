import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "abbc";
const coinType = 367;

const prefix = "ABBC";

export const encodeAbbcAddress = createEosEncoder(prefix);
export const decodeAbbcAddress = createEosDecoder(prefix);

export const abbc = {
  name,
  coinType,
  encode: encodeAbbcAddress,
  decode: decodeAbbcAddress,
} as const satisfies CheckedCoin;
