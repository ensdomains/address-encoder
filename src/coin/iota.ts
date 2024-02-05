import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "iota";
const coinType = 4218;

const hrp = "iota";
const version = new Uint8Array([0x00]);

const iotaBech32Encode = createBech32Encoder(hrp);
const iotaBech32Decode = createBech32Decoder(hrp);

export const encodeIotaAddress = (source: Uint8Array): string => {
  return iotaBech32Encode(concatBytes(version, source));
};
export const decodeIotaAddress = (source: string): Uint8Array => {
  const decoded = iotaBech32Decode(source);
  return decoded.slice(1);
};

export const iota = {
  name,
  coinType,
  encode: encodeIotaAddress,
  decode: decodeIotaAddress,
} as const satisfies CheckedCoin;
