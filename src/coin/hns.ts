import { bech32 } from "@scure/base";
import type { CheckedCoin } from "../types.js";

const name = "hns";
const coinType = 5353;

const hrp = "hs";
const versionBytes = new Uint8Array([0x00]);

export const encodeHnsAddress = (source: Uint8Array): string => {
  if (source.length !== 20) throw new Error("Unrecognised address format");
  return bech32.encode(hrp, [versionBytes[0], ...bech32.toWords(source)]);
};
export const decodeHnsAddress = (source: string): Uint8Array => {
  const { prefix, words } = bech32.decode(source);

  if (prefix !== hrp) throw new Error("Unrecognised address format");

  const version = words[0];
  const bytes = bech32.fromWords(words.slice(1));

  if (version !== versionBytes[0])
    throw new Error("Unrecognised address format");
  if (bytes.length !== 20) throw new Error("Unrecognised address format");

  return new Uint8Array(bytes);
};

export const hns = {
  name,
  coinType,
  encode: encodeHnsAddress,
  decode: decodeHnsAddress,
} as const satisfies CheckedCoin;
