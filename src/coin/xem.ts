import { keccak_256 } from "@noble/hashes/sha3";
import { bytesToHex } from "@noble/hashes/utils";
import { Coin } from "../types";
import { b32Decode, b32Encode } from "../utils/b32";

const name = "XEM";
const coinType = 43;

export const encodeXemAddress = (source: Uint8Array): string => {
  return b32Encode(source);
};

export const decodeXemAddress = (source: string): Uint8Array => {
  const address = source.toUpperCase().replace(/-/g, "");

  if (!address || address.length !== 40) throw new Error("Invalid address");

  const decoded = b32Decode(address);

  let checksum = bytesToHex(keccak_256(decoded.slice(0, 21))).slice(0, 8);

  if (checksum !== bytesToHex(decoded.slice(21)))
    throw new Error("Invalid address");

  return b32Decode(address);
};

export const xem = {
  name,
  coinType,
  encode: encodeXemAddress,
  decode: decodeXemAddress,
} as const satisfies Coin;
