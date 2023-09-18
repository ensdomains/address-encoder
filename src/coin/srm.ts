import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "SRM";
const coinType = 573;

export const encodeSrmAddress = bs58EncodeNoCheck;
export const decodeSrmAddress = bs58DecodeNoCheck;

export const srm = {
  name,
  coinType,
  encode: encodeSrmAddress,
  decode: decodeSrmAddress,
} as const satisfies Coin;
