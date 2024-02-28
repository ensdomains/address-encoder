import { sha256 } from "@noble/hashes/sha256";
import { concatBytes } from "@noble/hashes/utils";
import { base58, createBase58check } from "@scure/base";

export type Base58CheckVersion = Uint8Array;

const base58Unchecked = base58;
export const base58UncheckedEncode = base58Unchecked.encode;
export const base58UncheckedDecode = base58Unchecked.decode;

const base58Check = createBase58check(sha256);
export const base58CheckEncode = base58Check.encode;
export const base58CheckDecode = base58Check.decode;

export const createBase58VersionedEncoder =
  (p2pkhVersion: Base58CheckVersion, p2shVersion: Base58CheckVersion) =>
  (source: Uint8Array) => {
    // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
    if (source[0] === 0x76) {
      if (
        source[1] !== 0xa9 ||
        source[source.length - 2] !== 0x88 ||
        source[source.length - 1] !== 0xac
      ) {
        throw new Error("Unrecognised address format");
      }
      return base58CheckEncode(
        concatBytes(p2pkhVersion, source.slice(3, 3 + source[2]))
      );
    }

    // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
    if (source[0] === 0xa9) {
      if (source[source.length - 1] !== 0x87) {
        throw new Error("Unrecognised address format");
      }
      return base58CheckEncode(
        concatBytes(p2shVersion, source.slice(2, 2 + source[1]))
      );
    }

    throw new Error("Unrecognised address format");
  };

export const createBase58VersionedDecoder =
  (p2pkhVersions: Base58CheckVersion[], p2shVersions: Base58CheckVersion[]) =>
  (source: string): Uint8Array => {
    const addr = base58CheckDecode(source);

    // Checks if the first addr bytes are exactly equal to provided version field
    const checkVersion = (version: Base58CheckVersion) => {
      return version.every(
        (value, index) => index < addr.length && value === addr[index]
      );
    };
    if (p2pkhVersions.some(checkVersion))
      return concatBytes(
        new Uint8Array([0x76, 0xa9, 0x14]),
        addr.slice(p2pkhVersions[0].length),
        new Uint8Array([0x88, 0xac])
      );
    if (p2shVersions.some(checkVersion))
      return concatBytes(
        new Uint8Array([0xa9, 0x14]),
        addr.slice(p2shVersions[0].length),
        new Uint8Array([0x87])
      );
    throw new Error("Unrecognised address format");
  };
