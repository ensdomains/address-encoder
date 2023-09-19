import { Coin } from "../types";
import { createEosDecoder, createEosEncoder } from "../utils/eosio";

const name = "BTS";
const coinType = 308;

const prefix = "BTS";

export const encodeBtsAddress = createEosEncoder(prefix);
export const decodeBtsAddress = createEosDecoder(prefix);

export const bts = {
  name,
  coinType,
  encode: encodeBtsAddress,
  decode: decodeBtsAddress,
} as const satisfies Coin;
