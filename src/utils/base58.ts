import { sha256 } from "@noble/hashes/sha256";
import { concat } from "uint8arrays/concat";
import { createChecksumDecoder, createChecksumEncoder } from "./checksum";

export type Base58CheckVersion = number[];
export type Base58Options = {
  alphabet: string;
  base58Lookup: number[];
  leader: string;
};

const sha256x2 = (source: Uint8Array): Uint8Array => sha256(sha256(source));

const base = 58;
const factor = Math.log(base) / Math.log(256);
const iFactor = Math.log(256) / Math.log(base);

export const createBase58Options = (alphabet: string): Base58Options => {
  const base58Lookup: number[] = alphabet
    .split("")
    .reduce((acc, char, index) => {
      acc[char.charCodeAt(0)] = index;
      return acc;
    }, [] as number[]);
  const leader = alphabet[0];
  return { alphabet, base58Lookup, leader };
};

const DEFAULT_BASE58_OPTIONS = createBase58Options(
  "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
);

export const base58EncodeNoCheck = (
  source: Uint8Array,
  { alphabet, leader }: Base58Options = DEFAULT_BASE58_OPTIONS
) => {
  let pbegin = 0;
  let pend = source.length;
  let zeroes = 0;
  while (pbegin !== pend && source[pbegin] === 0) {
    pbegin++;
    zeroes++;
  }

  let size = ((pend - pbegin) * iFactor + 1) >>> 0;
  let b58 = new Uint8Array(size);

  let length = 0;
  while (pbegin !== pend) {
    let carry = source[pbegin];
    let i = 0;
    for (
      let it1 = size - 1;
      (carry !== 0 || i < length) && it1 !== -1;
      it1--, i++
    ) {
      carry += (256 * b58[it1]) >>> 0;
      b58[it1] = carry % base >>> 0;
      carry = (carry / base) >>> 0;
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry");
    }
    length = i;
    pbegin++;
  }

  let it2 = size - length;
  while (it2 !== size && b58[it2] === 0) {
    it2++;
  }

  let str = leader.repeat(zeroes);
  for (; it2 < size; ++it2) {
    str += alphabet.charAt(b58[it2]);
  }
  return str;
};

export const base58DecodeNoCheckUnsafe = (
  source: string,
  { base58Lookup, leader }: Base58Options = DEFAULT_BASE58_OPTIONS
): Uint8Array | undefined => {
  if (typeof source !== "string") {
    throw new TypeError("Expected String");
  }
  if (source.length === 0) {
    return new Uint8Array(0);
  }

  let psz = 0;
  let zeroes = 0;
  let length = 0;
  while (source[psz] === leader) {
    zeroes++;
    psz++;
  }

  let size = ((source.length - psz) * factor + 1) >>> 0;
  let b256 = new Uint8Array(size);

  while (source[psz]) {
    let carry = base58Lookup[source.charCodeAt(psz)];
    if (carry === 255) {
      return;
    }

    let i = 0;
    for (
      let it3 = size - 1;
      (carry !== 0 || i < length) && it3 !== -1;
      it3--, i++
    ) {
      carry += (base * b256[it3]) >>> 0;
      b256[it3] = carry % 256 >>> 0;
      carry = (carry / 256) >>> 0;
    }
    if (carry !== 0) {
      throw new Error("Non-zero carry");
    }
    length = i;
    psz++;
  }

  let it4 = size - length;
  while (it4 !== size && b256[it4] === 0) {
    it4++;
  }

  let vch = new Uint8Array(zeroes + (size - it4));
  vch.fill(0x00, 0, zeroes);
  let j = zeroes;
  while (it4 !== size) {
    vch[j++] = b256[it4++];
  }

  return vch;
};

export const base58DecodeNoCheck = (source: string): Uint8Array => {
  const value = base58DecodeNoCheckUnsafe(source);
  if (value) {
    return value;
  }
  throw new Error("Non-base58 character");
};

export const base58ChecksumEncode = createChecksumEncoder(4, sha256x2);

export const base58ChecksumDecode = createChecksumDecoder(4, sha256x2);

export const base58Encode = (source: Uint8Array): string => {
  const checksummed = base58ChecksumEncode(source);
  return base58EncodeNoCheck(checksummed);
};

export const base58Decode = (source: string): Uint8Array => {
  const buffer = base58DecodeNoCheck(source);
  const payload = base58ChecksumDecode(buffer);
  return payload;
};

export const createBase58WithCheckEncoder =
  (p2pkhVersion: Base58CheckVersion, p2shVersion: Base58CheckVersion) =>
  (source: Uint8Array) => {
    // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
    if (source[0] === 0x76) {
      if (
        source[1] !== 0xa9 ||
        source[source.length - 2] !== 0x88 ||
        source[source.length - 1] !== 0xac
      ) {
        throw Error("Unrecognised address format");
      }
      return base58Encode(
        concat([p2pkhVersion, source.slice(3, 3 + source[2])])
      );
    }

    // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
    if (source[0] === 0xa9) {
      if (source[source.length - 1] !== 0x87) {
        throw Error("Unrecognised address format");
      }
      return base58Encode(
        concat([p2shVersion, source.slice(2, 2 + source[1])])
      );
    }

    throw Error("Unrecognised address format");
  };

export const createBase58WithCheckDecoder =
  (p2pkhVersions: Base58CheckVersion[], p2shVersions: Base58CheckVersion[]) =>
  (source: string): Uint8Array => {
    const addr = base58Decode(source);

    // Checks if the first addr bytes are exactly equal to provided version field
    const checkVersion = (version: Base58CheckVersion) => {
      return version.every(
        (value, index) => index < addr.length && value === addr[index]
      );
    };
    if (p2pkhVersions.some(checkVersion))
      return concat([
        [0x76, 0xa9, 0x14],
        addr.slice(p2pkhVersions[0].length),
        [0x88, 0xac],
      ]);
    if (p2shVersions.some(checkVersion))
      return concat([[0xa9, 0x14], addr.slice(p2shVersions[0].length), [0x87]]);
    throw Error("Unrecognised address format");
  };
