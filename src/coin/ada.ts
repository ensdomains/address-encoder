import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";
import { byronDecode, byronEncode } from "../utils/byron.js";

const name = "ada";
const coinType = 1815;

const hrp = "addr";
const limit = 104;

const cardanoBech32Encode = createBech32Encoder(hrp, limit);
const cardanoBech32Decode = createBech32Decoder(hrp, limit);

export const encodeAdaAddress = (source: Uint8Array): string => {
  try {
    return byronEncode(source);
  } catch {
    return cardanoBech32Encode(source);
  }
};
export const decodeAdaAddress = (source: string): Uint8Array => {
  if (source.toLowerCase().startsWith(hrp)) {
    return cardanoBech32Decode(source);
  }
  return byronDecode(source);
};

export const ada = {
  name,
  coinType,
  encode: encodeAdaAddress,
  decode: decodeAdaAddress,
} as const satisfies CheckedCoin;
