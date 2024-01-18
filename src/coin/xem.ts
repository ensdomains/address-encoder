import { keccak_256 } from "@noble/hashes/sha3";
import type { CheckedCoin } from "../types.js";
import { base32Decode, base32Encode } from "../utils/base32.js";
import { bytesToHexWithoutPrefix } from "../utils/bytes.js";

const name = "xem";
const coinType = 43;

export const encodeXemAddress = base32Encode;

export const decodeXemAddress = (source: string): Uint8Array => {
  const address = source.toUpperCase().replace(/-/g, "");

  if (!address || address.length !== 40) throw new Error("Invalid address");

  const decoded = base32Decode(address);

  let checksum = bytesToHexWithoutPrefix(
    keccak_256(decoded.slice(0, 21))
  ).slice(0, 8);

  if (checksum !== bytesToHexWithoutPrefix(decoded.slice(21)))
    throw new Error("Invalid address");

  return decoded;
};

export const xem = {
  name,
  coinType,
  encode: encodeXemAddress,
  decode: decodeXemAddress,
} as const satisfies CheckedCoin;
