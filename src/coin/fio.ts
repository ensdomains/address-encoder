import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "fio";
const coinType = 235;

const prefix = "FIO";

export const encodeFioAddress = createEosEncoder(prefix);
export const decodeFioAddress = createEosDecoder(prefix);

export const fio = {
  name,
  coinType,
  encode: encodeFioAddress,
  decode: decodeFioAddress,
} as const satisfies CheckedCoin;
