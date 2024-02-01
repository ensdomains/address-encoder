import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "luna";
const coinType = 330;

const hrp = "terra";

export const encodeLunaAddress = createBech32Encoder(hrp);
export const decodeLunaAddress = createBech32Decoder(hrp);

export const luna = {
  name,
  coinType,
  encode: encodeLunaAddress,
  decode: decodeLunaAddress,
} as const satisfies CheckedCoin;
