import { keccak_256 } from "@noble/hashes/sha3";
import type { CheckedCoin } from "../types.js";
import {
  bytesToHexWithoutPrefix,
  hexToBytes,
  stringToBytes,
  type Hex,
} from "../utils/bytes.js";
import { isAddress } from "../utils/hex.js";

const name = "wan";
const coinType = 5718350;

const wanChecksum = (addressBytes: Uint8Array): string => {
  const addressStr = bytesToHexWithoutPrefix(addressBytes);
  const address = addressStr.split("");
  // hash of string representation of hex address
  // this is intentional
  const hash = keccak_256(stringToBytes(addressStr));

  let hashByte: number;
  for (let i = 0; i < 40; i++) {
    hashByte = hash[Math.floor(i / 2)];

    if (i % 2 === 0) hashByte = hashByte >> 4;
    else hashByte &= 0xf;

    if (address[i] > "9" && hashByte <= 7)
      address[i] = address[i].toUpperCase();
  }

  return `0x${address.join("")}`;
};

export const encodeWanAddress = (source: Uint8Array): string => {
  return wanChecksum(source);
};
export const decodeWanAddress = (source: string): Uint8Array => {
  if (!isAddress(source)) throw new Error("Unrecognised address format");

  const bytes = hexToBytes(source as Hex);

  if (wanChecksum(bytes) !== source)
    throw new Error("Unrecognised address format");

  return bytes;
};

export const wan = {
  name,
  coinType,
  encode: encodeWanAddress,
  decode: decodeWanAddress,
} as const satisfies CheckedCoin;
