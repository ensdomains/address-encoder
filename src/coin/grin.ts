import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "GRIN";
const coinType = 592;

const hrp = "grin";

export const encodeGrinAddress = createBech32Encoder(hrp);
export const decodeGrinAddress = createBech32Decoder(hrp);

export const grin = {
  name,
  coinType,
  encode: encodeGrinAddress,
  decode: decodeGrinAddress,
} satisfies Coin;
