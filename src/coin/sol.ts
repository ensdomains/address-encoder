import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "SOL";
const coinType = 501;

export const encodeSolAddress = bs58EncodeNoCheck;
export const decodeSolAddress = bs58DecodeNoCheck;

export const sol = {
  name,
  coinType,
  encode: encodeSolAddress,
  decode: decodeSolAddress,
} as const satisfies Coin;
