import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "ONE";
const coinType = 1023;

const hrp = "one";

export const encodeOneAddress = createBech32Encoder(hrp);
export const decodeOneAddress = createBech32Decoder(hrp);

export const one = {
  name,
  coinType,
  encode: encodeOneAddress,
  decode: decodeOneAddress,
} satisfies Coin;
