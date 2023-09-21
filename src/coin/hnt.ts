import { concatBytes } from "@noble/hashes/utils";
import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

const name = "hnt";
const coinType = 904;

export const encodeHntAddress = (source: Uint8Array): string => {
  const sourceWithVersion = concatBytes(new Uint8Array([0x00]), source);
  return base58Encode(sourceWithVersion);
};
export const decodeHntAddress = (source: string): Uint8Array => {
  const decoded = base58Decode(source);

  const version = decoded[0];
  if (version !== 0) throw new Error("Unrecognised address format");

  return decoded.slice(1);
};

export const hnt = {
  name,
  coinType,
  encode: encodeHntAddress,
  decode: decodeHntAddress,
} as const satisfies Coin;
