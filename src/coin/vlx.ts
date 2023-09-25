import type { Coin } from "../types.js";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58.js";

const name = "vlx";
const coinType = 574;

export const encodeVlxAddress = base58EncodeNoCheck;
export const decodeVlxAddress = base58DecodeNoCheck;

export const vlx = {
  name,
  coinType,
  encode: encodeVlxAddress,
  decode: decodeVlxAddress,
} as const satisfies Coin;
