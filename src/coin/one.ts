import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

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
} as const satisfies Coin;
