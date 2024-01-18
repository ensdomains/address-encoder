import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "iris";
const coinType = 566;

const hrp = "iaa";

export const encodeIrisAddress = createBech32Encoder(hrp);
export const decodeIrisAddress = createBech32Decoder(hrp);

export const iris = {
  name,
  coinType,
  encode: encodeIrisAddress,
  decode: decodeIrisAddress,
} as const satisfies CheckedCoin;
