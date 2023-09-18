import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "KAVA";
const coinType = 459;

const hrp = "kava";

export const encodeKavaAddress = createBech32Encoder(hrp);
export const decodeKavaAddress = createBech32Decoder(hrp);

export const kava = {
  name,
  coinType,
  encode: encodeKavaAddress,
  decode: decodeKavaAddress,
} as const satisfies Coin;
