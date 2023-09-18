import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "EGLD";
const coinType = 120;

export const encodeEgldAddress = createBech32Encoder("erd");
export const decodeEgldAddress = createBech32Decoder("erd");

export const egld = {
  name,
  coinType,
  encode: encodeEgldAddress,
  decode: decodeEgldAddress,
} satisfies Coin;
