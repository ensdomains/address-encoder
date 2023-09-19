import { blake2b } from "@noble/hashes/blake2b";
import { keccak_256 } from "@noble/hashes/sha3";
import { Coin } from "../types";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "../utils/base58";
import { createChecksumDecoder } from "../utils/checksum";

const name = "WAVES";
const coinType = 5741564;

const checksumFn = (source: Uint8Array): Uint8Array =>
  keccak_256(blake2b(source, { dkLen: 32 }));
const checksumLength = 4;
const wavesChecksumDecode = createChecksumDecoder(checksumLength, checksumFn);

export const encodeWavesAddress = base58EncodeNoCheck;
export const decodeWavesAddress = (source: string): Uint8Array => {
  const decoded = base58DecodeNoCheck(source);

  if (decoded[0] !== 1) throw new Error("Invalid address format");

  if (decoded[1] !== 87 || decoded.length !== 26)
    throw new Error("Invalid address format");

  wavesChecksumDecode(decoded);

  return decoded;
};

export const waves = {
  name,
  coinType,
  encode: encodeWavesAddress,
  decode: decodeWavesAddress,
} as const satisfies Coin;
