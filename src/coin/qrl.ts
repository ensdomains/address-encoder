import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex, hexToBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";

const name = "qrl";
const coinType = 238;

const qrlPrefix = "Q";
const qrlLength = 79;
const qrlPayloadHexLength = 70;
const qrlChecksumHexLength = 8;
const qrlAddressRegex = /^Q[0-9a-fA-F]{78}$/;

const computeChecksum = (payloadHex: string): string => {
  const payloadBytes = hexToBytes(payloadHex);
  const hashHex = bytesToHex(sha256(payloadBytes));
  return hashHex.slice(-qrlChecksumHexLength);
};

const assertValidQrlAddress = (source: string): void => {
  if (!qrlAddressRegex.test(source))
    throw new Error("Unrecognised address format");
  if (source.length !== qrlLength) throw new Error("Unrecognised address format");

  const payloadHex = source.slice(1, 1 + qrlPayloadHexLength);
  const checksumHex = source.slice(1 + qrlPayloadHexLength);
  if (computeChecksum(payloadHex) !== checksumHex.toLowerCase())
    throw new Error("Unrecognised address format");
};

export const encodeQrlAddress = (source: Uint8Array): string => {
  const hex = bytesToHex(source).toLowerCase();
  if (hex.length !== qrlPayloadHexLength + qrlChecksumHexLength)
    throw new Error("Unrecognised address format");

  const address = `${qrlPrefix}${hex}`;
  assertValidQrlAddress(address);
  return address;
};

export const decodeQrlAddress = (source: string): Uint8Array => {
  assertValidQrlAddress(source);
  return hexToBytes(source.slice(1).toLowerCase());
};

export const qrl = {
  name,
  coinType,
  encode: encodeQrlAddress,
  decode: decodeQrlAddress,
} as const satisfies CheckedCoin;
