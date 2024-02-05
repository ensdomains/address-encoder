import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "grin";
const coinType = 592;

const hrp = "grin";

export const encodeGrinAddress = createBech32Encoder(hrp);
export const decodeGrinAddress = createBech32Decoder(hrp);

export const grin = {
  name,
  coinType,
  encode: encodeGrinAddress,
  decode: decodeGrinAddress,
} as const satisfies CheckedCoin;
