import type { Coin } from "../types.js";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58.js";

const name = "sol";
const coinType = 501;

export const encodeSolAddress = base58EncodeNoCheck;
export const decodeSolAddress = base58DecodeNoCheck;

export const sol = {
  name,
  coinType,
  encode: encodeSolAddress,
  decode: decodeSolAddress,
} as const satisfies Coin;
