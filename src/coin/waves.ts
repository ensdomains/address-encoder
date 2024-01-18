import { blake2b } from "@noble/hashes/blake2b";
import { keccak_256 } from "@noble/hashes/sha3";
import { utils } from "@scure/base";
import type { CheckedCoin } from "../types.js";
import {
  base58UncheckedDecode,
  base58UncheckedEncode,
} from "../utils/base58.js";

const name = "waves";
const coinType = 5741564;

const checksumFn = (source: Uint8Array): Uint8Array =>
  keccak_256(blake2b(source, { dkLen: 32 }));
const checksumLength = 4;
const wavesChecksum = utils.checksum(checksumLength, checksumFn);

export const encodeWavesAddress = base58UncheckedEncode;
export const decodeWavesAddress = (source: string): Uint8Array => {
  const decoded = base58UncheckedDecode(source);

  if (decoded[0] !== 1) throw new Error("Invalid address format");

  if (decoded[1] !== 87 || decoded.length !== 26)
    throw new Error("Invalid address format");

  wavesChecksum.decode(decoded);

  return decoded;
};

export const waves = {
  name,
  coinType,
  encode: encodeWavesAddress,
  decode: decodeWavesAddress,
} as const satisfies CheckedCoin;
