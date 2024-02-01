import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "bnb";
const coinType = 714;

const hrp = "bnb";

export const encodeBnbAddress = createBech32Encoder(hrp);
export const decodeBnbAddress = createBech32Decoder(hrp);

export const bnb = {
  name,
  coinType,
  encode: encodeBnbAddress,
  decode: decodeBnbAddress,
} as const satisfies CheckedCoin;
