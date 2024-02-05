import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "hive";
const coinType = 825;

const prefix = "STM";

export const encodeHiveAddress = createEosEncoder(prefix);
export const decodeHiveAddress = createEosDecoder(prefix);

export const hive = {
  name,
  coinType,
  encode: encodeHiveAddress,
  decode: decodeHiveAddress,
} as const satisfies CheckedCoin;
