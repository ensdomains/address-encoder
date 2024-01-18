import type { CheckedCoin } from "../types.js";
import { bytesToHex, hexWithoutPrefixToBytes } from "../utils/bytes.js";

const name = "aion";
const coinType = 425;

const hexRegex = /^[0-9A-Fa-f]{64}$/g;

export const encodeAionAddress = (source: Uint8Array): string => {
  if (source.length !== 32) throw new Error("Unrecognised address format");
  return bytesToHex(source);
};
export const decodeAionAddress = (source: string): Uint8Array => {
  const noPrefix = source.startsWith("0x") ? source.slice(2) : source;
  if (noPrefix.length !== 64) throw new Error("Unrecognised address format");
  if (!hexRegex.test(noPrefix)) throw new Error("Unrecognised address format");
  return hexWithoutPrefixToBytes(noPrefix);
};

export const aion = {
  name,
  coinType,
  encode: encodeAionAddress,
  decode: decodeAionAddress,
} as const satisfies CheckedCoin;
