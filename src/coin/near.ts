import { Coin } from "../types";
import { bytesToString, stringToBytes } from "../utils/bytes";
import { validateNearAddress } from "../utils/near";

const name = "NEAR";
const coinType = 397;

export const encodeNearAddress = (source: Uint8Array): string => {
  const encoded = bytesToString(source);
  if (!validateNearAddress(encoded))
    throw new Error("Unrecognised address format");
  return encoded;
};
export const decodeNearAddress = (source: string): Uint8Array => {
  if (!validateNearAddress(source))
    throw new Error("Unrecognised address format");
  return stringToBytes(source);
};

export const near = {
  name,
  coinType,
  encode: encodeNearAddress,
  decode: decodeNearAddress,
} as const satisfies Coin;
