import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "ELA";
const coinType = 2305;

export const encodeElaAddress = bs58EncodeNoCheck;
export const decodeElaAddress = bs58DecodeNoCheck;

export const ela = {
  name,
  coinType,
  encode: encodeElaAddress,
  decode: decodeElaAddress,
} satisfies Coin;
