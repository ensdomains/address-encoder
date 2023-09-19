import { Coin } from "../types";
import { createEosDecoder, createEosEncoder } from "../utils/eosio";

const name = "ABBC";
const coinType = 367;

const prefix = "ABBC";

export const encodeAbbcAddress = createEosEncoder(prefix);
export const decodeAbbcAddress = createEosDecoder(prefix);

export const abbc = {
  name,
  coinType,
  encode: encodeAbbcAddress,
  decode: decodeAbbcAddress,
} as const satisfies Coin;
