import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "bts";
const coinType = 308;

const prefix = "BTS";

export const encodeBtsAddress = createEosEncoder(prefix);
export const decodeBtsAddress = createEosDecoder(prefix);

export const bts = {
  name,
  coinType,
  encode: encodeBtsAddress,
  decode: decodeBtsAddress,
} as const satisfies CheckedCoin;
