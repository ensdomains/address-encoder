import { sha256 } from "@noble/hashes/sha256";
import { concat } from "uint8arrays/concat";
import {
  createBaseObject,
  createDecoderFromBaseObject,
  createEncoderFromBaseObject,
  createUnsafeDecoderFromBaseObject,
} from "./base";

export type Base58CheckVersion = number[];

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const bs58BaseObject = createBaseObject(alphabet);

export const bs58EncodeNoCheck = createEncoderFromBaseObject(bs58BaseObject);
export const bs58DecodeNoCheckUnsafe =
  createUnsafeDecoderFromBaseObject(bs58BaseObject);
export const bs58DecodeNoCheck = createDecoderFromBaseObject(bs58BaseObject);

const sha256x2 = (source: Uint8Array): Uint8Array => sha256(sha256(source));

export const bs58Encode = (source: Uint8Array): string => {
  const checksum = sha256x2(source);
  const length = source.length + 4;
  const both = new Uint8Array(length);
  both.set(source, 0);
  both.set(checksum.subarray(0, 4), source.length);
  return bs58EncodeNoCheck(both);
};

export const bs58DecodeRaw = (source: Uint8Array): Uint8Array | undefined => {
  const payload = source.slice(0, -4);
  const checksum = source.slice(-4);
  const newChecksum = sha256x2(source);

  if (
    (checksum[0] ^ newChecksum[0]) |
    (checksum[1] ^ newChecksum[1]) |
    (checksum[2] ^ newChecksum[2]) |
    (checksum[3] ^ newChecksum[3])
  )
    return;

  return payload;
};

export const bs58DecodeUnsafe = (source: string): Uint8Array | undefined => {
  const output = bs58DecodeNoCheckUnsafe(source);
  if (!output) return;

  return bs58DecodeRaw(output);
};

export const bs58Decode = (source: string): Uint8Array => {
  const buffer = bs58DecodeNoCheck(source);
  const payload = bs58DecodeRaw(buffer);
  if (!payload) throw new Error("Invalid checksum");
  return payload;
};

export const createBase58WithCheckEncoder =
  (p2pkhVersion: Base58CheckVersion, p2shVersion: Base58CheckVersion) =>
  (source: Uint8Array) => {
    let addr: Uint8Array;
    switch (source[0]) {
      case 0x76: // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
        if (
          source[1] !== 0xa9 ||
          source[source.length - 2] !== 0x88 ||
          source[source.length - 1] !== 0xac
        ) {
          throw Error("Unrecognised address format");
        }
        addr = concat([
          Uint8Array.of(...p2pkhVersion),
          source.slice(3, 3 + source[2]),
        ]);
        return bs58Encode(addr);
      case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (source[source.length - 1] !== 0x87) {
          throw Error("Unrecognised address format");
        }
        addr = concat([
          Uint8Array.of(...p2shVersion),
          source.slice(2, 2 + source[1]),
        ]);
        return bs58Encode(addr);
      default:
        throw Error("Unrecognised address format");
    }
  };

export const createBase58WithCheckDecoder =
  (p2pkhVersions: Base58CheckVersion[], p2shVersions: Base58CheckVersion[]) =>
  (source: string): Uint8Array => {
    const addr = bs58Decode(source);

    // Checks if the first addr bytes are exactly equal to provided version field
    const checkVersion = (version: Base58CheckVersion) => {
      return version.every(
        (value, index) => index < addr.length && value === addr[index]
      );
    };
    if (p2pkhVersions.some(checkVersion))
      return concat([
        Uint8Array.of(0x76, 0xa9, 0x14),
        addr.slice(p2pkhVersions[0].length),
        Uint8Array.of(0x88, 0xac),
      ]);
    if (p2pkhVersions.some(checkVersion))
      return concat([
        Uint8Array.of(0xa9, 0x14),
        addr.slice(p2shVersions[0].length),
        Uint8Array.of(0x87),
      ]);
    throw Error("Unrecognised address format");
  };
