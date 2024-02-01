import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "atom";
const coinType = 118;

export const encodeAtomAddress = createBech32Encoder("cosmos");
export const decodeAtomAddress = createBech32Decoder("cosmos");

export const atom = {
  name,
  coinType,
  encode: encodeAtomAddress,
  decode: decodeAtomAddress,
} as const satisfies CheckedCoin;
