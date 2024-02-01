import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "zil";
const coinType = 313;

export const encodeZilAddress = createBech32Encoder("zil");
export const decodeZilAddress = createBech32Decoder("zil");

export const zil = {
  name,
  coinType,
  encode: encodeZilAddress,
  decode: decodeZilAddress,
} as const satisfies CheckedCoin;
