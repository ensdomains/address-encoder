import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "RUNE";
const coinType = 931;

const hrp = "thor";

export const encodeRuneAddress = createBech32Encoder(hrp);
export const decodeRuneAddress = createBech32Decoder(hrp);

export const rune = {
  name,
  coinType,
  encode: encodeRuneAddress,
  decode: decodeRuneAddress,
} satisfies Coin;
