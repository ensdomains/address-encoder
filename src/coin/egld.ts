import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "egld";
const coinType = 508;

export const encodeEgldAddress = createBech32Encoder("erd");
export const decodeEgldAddress = createBech32Decoder("erd");

export const egld = {
  name,
  coinType,
  encode: encodeEgldAddress,
  decode: decodeEgldAddress,
} as const satisfies CheckedCoin;
