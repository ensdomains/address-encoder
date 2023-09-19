import { Coin } from "../types";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58";

const name = "SOL";
const coinType = 501;

export const encodeSolAddress = base58EncodeNoCheck;
export const decodeSolAddress = base58DecodeNoCheck;

export const sol = {
  name,
  coinType,
  encode: encodeSolAddress,
  decode: decodeSolAddress,
} as const satisfies Coin;
