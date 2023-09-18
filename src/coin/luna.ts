import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "LUNA";
const coinType = 330;

const hrp = "terra";

export const encodeLunaAddress = createBech32Encoder(hrp);
export const decodeLunaAddress = createBech32Decoder(hrp);

export const luna = {
  name,
  coinType,
  encode: encodeLunaAddress,
  decode: decodeLunaAddress,
} as const satisfies Coin;
