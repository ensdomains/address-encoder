import type { CheckedCoin } from "../types.js";
import {
  bytesToHex,
  hexToBytes,
} from "../utils/bytes.js";
import { stripHexPrefix } from "../utils/hex.js";

const name = "sui";
const coinType = 784;

export const encodeSuiAddress = (source: Uint8Array) => {
  if (source.length !== 32) throw new Error("Unrecognised address format");

  const encoded = bytesToHex(source);
  return encoded.toLowerCase();
};

export const decodeSuiAddress = (source: string) => {
  const stripped = stripHexPrefix(source);
  
  // Check if the address has the correct format (64 hex chars)
  if (!/^0x[a-fA-F0-9]{64}$/.test(source) && !/^[a-fA-F0-9]{64}$/.test(stripped)) {
    throw new Error("Unrecognised address format");
  }

  const decoded = hexToBytes(`0x${stripped}` as const);
  if (decoded.length !== 32) throw new Error("Unrecognised address format");

  return decoded;
};

export const sui = {
  name,
  coinType,
  encode: encodeSuiAddress,
  decode: decodeSuiAddress,
} as const satisfies CheckedCoin;