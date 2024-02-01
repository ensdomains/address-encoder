import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "rune";
const coinType = 931;

const hrp = "thor";

export const encodeRuneAddress = createBech32Encoder(hrp);
export const decodeRuneAddress = createBech32Decoder(hrp);

export const rune = {
  name,
  coinType,
  encode: encodeRuneAddress,
  decode: decodeRuneAddress,
} as const satisfies CheckedCoin;
