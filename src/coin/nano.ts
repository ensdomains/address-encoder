import { blake2b } from "@noble/hashes/blake2b";
import { Coin } from "../types";
import {
  base32Decode,
  base32Encode,
  createBase32Options,
} from "../utils/base32";

const name = "nano";
const coinType = 165;

const nanoBase32Options = createBase32Options({
  alphabet: "13456789abcdefghijkmnopqrstuwxyz",
});

export const encodeNanoAddress = (source: Uint8Array): string => {
  const encoded = base32Encode(source, nanoBase32Options);
  const checksum = blake2b(source, { dkLen: 5 }).reverse();
  const checksumEncoded = base32Encode(checksum, nanoBase32Options);
  return `nano_${encoded}${checksumEncoded}`;
};
export const decodeNanoAddress = (source: string): Uint8Array => {
  const decoded = base32Decode(source.slice(5), nanoBase32Options);
  return decoded.slice(0, -5);
};

export const nano = {
  name,
  coinType,
  encode: encodeNanoAddress,
  decode: decodeNanoAddress,
} as const satisfies Coin;
