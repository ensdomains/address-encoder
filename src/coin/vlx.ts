import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "VLX";
const coinType = 574;

export const encodeVlxAddress = bs58EncodeNoCheck;
export const decodeVlxAddress = bs58DecodeNoCheck;

export const vlx = {
  name,
  coinType,
  encode: encodeVlxAddress,
  decode: decodeVlxAddress,
} as const satisfies Coin;
