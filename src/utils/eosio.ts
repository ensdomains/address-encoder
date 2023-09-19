import { secp256k1 } from "@noble/curves/secp256k1";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { base58DecodeNoCheck, base58EncodeNoCheck } from "./base58";
import { createChecksumDecoder, createChecksumEncoder } from "./checksum";

const checksumLength = 4;
const checksumFn = ripemd160;

const eosChecksumEncode = createChecksumEncoder(checksumLength, checksumFn);
const eosChecksumDecode = createChecksumDecoder(checksumLength, checksumFn);

export const createEosEncoder =
  (prefix: string) =>
  (source: Uint8Array): string => {
    const point = secp256k1.ProjectivePoint.fromHex(source);
    const checksummed = eosChecksumEncode(point.toRawBytes(true));
    const encoded = base58EncodeNoCheck(checksummed);
    return `${prefix}${encoded}`;
  };

export const createEosDecoder =
  (prefix: string) =>
  (source: string): Uint8Array => {
    if (!source.startsWith(prefix)) throw Error("Unrecognised address format");
    const prefixStripped = source.slice(prefix.length);
    const decoded = base58DecodeNoCheck(prefixStripped);
    const checksummed = eosChecksumDecode(decoded);
    return checksummed;
  };
