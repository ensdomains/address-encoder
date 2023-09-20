import { Coin } from "../types";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58";

const name = "SERO";
const coinType = 569;

export const encodeSeroAddress = base58EncodeNoCheck;
export const decodeSeroAddress = (source: string): Uint8Array => {
  const decoded = base58DecodeNoCheck(source);
  if (decoded.length !== 96) throw new Error("Unrecognised address format");
  return decoded;
};

export const sero = {
  name,
  coinType,
  encode: encodeSeroAddress,
  decode: decodeSeroAddress,
} as const satisfies Coin;
