import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "ZIL";
const coinType = 119;

export const encodeZilAddress = createBech32Encoder("zil");
export const decodeZilAddress = createBech32Decoder("zil");

export const zil = {
  name,
  coinType,
  encode: encodeZilAddress,
  decode: decodeZilAddress,
} satisfies Coin;
