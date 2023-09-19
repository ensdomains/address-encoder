import { Coin } from "../types";
import { createEosDecoder, createEosEncoder } from "../utils/eosio";

const name = "EOS";
const coinType = 194;

const prefix = "EOS";

export const encodeEosAddress = createEosEncoder(prefix);
export const decodeEosAddress = createEosDecoder(prefix);

export const eos = {
  name,
  coinType,
  encode: encodeEosAddress,
  decode: decodeEosAddress,
} as const satisfies Coin;
