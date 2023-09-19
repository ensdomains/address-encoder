import { Coin } from "../types";
import { createEosDecoder, createEosEncoder } from "../utils/eosio";

const name = "STEEM";
const coinType = 135;

const prefix = "STM";

export const encodeSteemAddress = createEosEncoder(prefix);
export const decodeSteemAddress = createEosDecoder(prefix);

export const steem = {
  name,
  coinType,
  encode: encodeSteemAddress,
  decode: decodeSteemAddress,
} as const satisfies Coin;
