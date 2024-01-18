import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "one";
const coinType = 1023;

const hrp = "one";

export const encodeOneAddress = createBech32Encoder(hrp);
export const decodeOneAddress = createBech32Decoder(hrp);

export const one = {
  name,
  coinType,
  encode: encodeOneAddress,
  decode: decodeOneAddress,
} as const satisfies CheckedCoin;
