import { concat } from "uint8arrays/concat";
import {
  createBaseObject,
  createDecoderFromBaseObject,
  createEncoderFromBaseObject,
} from "./base";

const alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const bs58BaseObject = createBaseObject(alphabet);

export const bs58Encode = createEncoderFromBaseObject(bs58BaseObject);
export const bs58Decode = createDecoderFromBaseObject(bs58BaseObject);

export type Base58CheckVersion = number[];

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
