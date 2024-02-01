import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "ckb";
const coinType = 309;

const hrp = "ckb";

export const encodeCkbAddress = createBech32Encoder(hrp);
export const decodeCkbAddress = createBech32Decoder(hrp);

export const ckb = {
  name,
  coinType,
  encode: encodeCkbAddress,
  decode: decodeCkbAddress,
} as const satisfies CheckedCoin;
