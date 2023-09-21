import { Coin } from "../types";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58";

const name = "ela";
const coinType = 2305;

export const encodeElaAddress = base58EncodeNoCheck;
export const decodeElaAddress = base58DecodeNoCheck;

export const ela = {
  name,
  coinType,
  encode: encodeElaAddress,
  decode: decodeElaAddress,
} as const satisfies Coin;
