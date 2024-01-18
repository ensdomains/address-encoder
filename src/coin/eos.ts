import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "eos";
const coinType = 194;

const prefix = "EOS";

export const encodeEosAddress = createEosEncoder(prefix);
export const decodeEosAddress = createEosDecoder(prefix);

export const eos = {
  name,
  coinType,
  encode: encodeEosAddress,
  decode: decodeEosAddress,
} as const satisfies CheckedCoin;
