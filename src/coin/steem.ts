import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "steem";
const coinType = 135;

const prefix = "STM";

export const encodeSteemAddress = createEosEncoder(prefix);
export const decodeSteemAddress = createEosDecoder(prefix);

export const steem = {
  name,
  coinType,
  encode: encodeSteemAddress,
  decode: decodeSteemAddress,
} as const satisfies CheckedCoin;
