import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { createBase58VersionedDecoder } from "../utils/base58.js";
import {
  decodeBchAddressToTypeAndHash,
  encodeBchAddressWithVersion,
} from "../utils/bch.js";

const name = "bch";
const coinType = 145;

const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];

const bchBase58Decode = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const encodeBchAddress = (source: Uint8Array): string => {
  if (source[0] === 0x76) {
    if (
      source[1] !== 0xa9 ||
      source[source.length - 2] !== 0x88 ||
      source[source.length - 1] !== 0xac
    )
      throw new Error("Unrecognised address format");

    return encodeBchAddressWithVersion(0, source.slice(3, 3 + source[2]));
  }
  if (source[0] === 0xa9) {
    if (source[source.length - 1] !== 0x87)
      throw new Error("Unrecognised address format");

    return encodeBchAddressWithVersion(8, source.slice(2, 2 + source[1]));
  }

  throw new Error("Unrecognised address format");
};
export const decodeBchAddress = (source: string): Uint8Array => {
  try {
    return bchBase58Decode(source);
  } catch {
    const { type, hash } = decodeBchAddressToTypeAndHash(source);
    if (type === 0)
      return concatBytes(
        new Uint8Array([0x76, 0xa9, 0x14]),
        new Uint8Array(hash),
        new Uint8Array([0x88, 0xac])
      );
    if (type === 8)
      return concatBytes(
        new Uint8Array([0xa9, 0x14]),
        new Uint8Array(hash),
        new Uint8Array([0x87])
      );
    throw new Error("Unrecognised address format");
  }
};

export const bch = {
  name,
  coinType,
  encode: encodeBchAddress,
  decode: decodeBchAddress,
} as const satisfies CheckedCoin;
