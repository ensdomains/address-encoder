import { secp256k1 } from "@noble/curves/secp256k1";
import { ripemd160 } from "@noble/hashes/ripemd160";
import { utils } from "@scure/base";
import { base58UncheckedDecode, base58UncheckedEncode } from "./base58.js";

const eosChecksum = utils.checksum(4, ripemd160);

export const createEosEncoder =
  (prefix: string) =>
  (source: Uint8Array): string => {
    const point = secp256k1.ProjectivePoint.fromHex(source);
    const checksummed = eosChecksum.encode(point.toRawBytes(true));
    const encoded = base58UncheckedEncode(checksummed);
    return `${prefix}${encoded}`;
  };

export const createEosDecoder =
  (prefix: string) =>
  (source: string): Uint8Array => {
    if (!source.startsWith(prefix))
      throw new Error("Unrecognised address format");
    const prefixStripped = source.slice(prefix.length);
    const decoded = base58UncheckedDecode(prefixStripped);
    const checksummed = eosChecksum.decode(decoded);
    return checksummed;
  };
