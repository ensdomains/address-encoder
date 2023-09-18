import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "IOST";
const coinType = 291;

export const encodeIostAddress = bs58EncodeNoCheck;
export const decodeIostAddress = bs58DecodeNoCheck;

export const iost = {
  name,
  coinType,
  encode: encodeIostAddress,
  decode: decodeIostAddress,
} satisfies Coin;
