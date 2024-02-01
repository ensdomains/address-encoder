import type { CheckedCoin } from "../types.js";
import { createEosDecoder, createEosEncoder } from "../utils/eosio.js";

const name = "gxc";
const coinType = 2303;

const prefix = "GXC";

export const encodeGxcAddress = createEosEncoder(prefix);
export const decodeGxcAddress = createEosDecoder(prefix);

export const gxc = {
  name,
  coinType,
  encode: encodeGxcAddress,
  decode: decodeGxcAddress,
} as const satisfies CheckedCoin;
