import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "nuls";
const coinType = 8964;

const prefixReference = ["a", "b", "c", "d", "e"];

const decodePrefix = (source: string): string => {
  for (let i = 0; i < source.length; i++) {
    const value = source.charCodeAt(i);
    if (value >= 97) {
      return source.slice(i + 1);
    }
  }
  throw new Error("Unrecognised address format");
};

export const encodeNulsAddress = (source: Uint8Array): string => {
  const chainId = (source[0] & 0xff) | ((source[1] & 0xff) << 8);
  const payload = new Uint8Array(source.length + 1);

  let xor = 0x00;
  for (let i = 0; i < source.length; i++) {
    const byte = source[i];
    const value = byte > 127 ? byte - 256 : byte;
    payload[i] = value;
    xor ^= value;
  }
  payload[source.length] = xor;

  let prefix: string;
  if (chainId === 1) prefix = "NULS";
  else if (chainId === 2) prefix = "tNULS";
  else {
    const chainIdBytes = concatBytes(
      new Uint8Array([0xff & (chainId >> 0)]),
      new Uint8Array([0xff & (chainId >> 8)])
    );
    prefix = base58UncheckedEncode(chainIdBytes).toUpperCase();
  }

  return (
    prefix + prefixReference[prefix.length - 1] + base58UncheckedEncode(payload)
  );
};
export const decodeNulsAddress = (source: string): Uint8Array => {
  let sourceWithoutPrefix: string;
  if (source.startsWith("NULS")) sourceWithoutPrefix = source.slice(5);
  else if (source.startsWith("tNULS")) sourceWithoutPrefix = source.slice(6);
  else sourceWithoutPrefix = decodePrefix(source);

  const payload = base58UncheckedDecode(sourceWithoutPrefix);

  let xor = 0x00;
  for (let i = 0; i < payload.length - 1; i++) {
    const byte = payload[i];
    const value = byte > 127 ? byte - 256 : byte;
    payload[i] = value;
    xor ^= value;
  }

  if (xor < 0) xor += 256;

  if (xor !== payload[payload.length - 1])
    throw new Error("Unrecognised address format");

  return payload.slice(0, -1);
};

export const nuls = {
  name,
  coinType,
  encode: encodeNulsAddress,
  decode: decodeNulsAddress,
} as const satisfies CheckedCoin;
