import { blake2b } from "@noble/hashes/blake2b";
import { keccak_256 } from "@noble/hashes/sha3";
import { Coin } from "../types";
import {
  bs58DecodeNoCheck,
  bs58EncodeNoCheck,
  bs58VerifyChecksum,
} from "../utils/bs58";

const name = "WAVES";
const coinType = 5741564;

const checksumFn = (source: Uint8Array): Uint8Array =>
  keccak_256(blake2b(source, { dkLen: 32 }));

export const encodeWavesAddress = bs58EncodeNoCheck;
export const decodeWavesAddress = (source: string): Uint8Array => {
  const decoded = bs58DecodeNoCheck(source);

  if (decoded[0] !== 1) throw new Error("Invalid address format");

  if (decoded[1] !== 87 || decoded.length !== 26)
    throw new Error("Invalid address format");

  if (!bs58VerifyChecksum(decoded, checksumFn))
    throw new Error("Invalid checksum");

  return decoded;
};

export const waves = {
  name,
  coinType,
  encode: encodeWavesAddress,
  decode: decodeWavesAddress,
} as const satisfies Coin;
