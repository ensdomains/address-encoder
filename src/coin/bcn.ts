import { equalBytes } from "@noble/curves/abstract/utils";
import { keccak_256 } from "@noble/hashes/sha3";
import { concatBytes } from "@noble/hashes/utils";
import { utils } from "@scure/base";
import type { CheckedCoin } from "../types.js";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr.js";

const name = "bcn";
const coinType = 204;

const bcnChecksum = utils.checksum(4, keccak_256);

export const encodeBcnAddress = (source: Uint8Array): string => {
  const checksum = keccak_256(source).slice(0, 4);
  return encodeXmrAddress(concatBytes(source, checksum));
};
export const decodeBcnAddress = (source: string): Uint8Array => {
  const decoded = decodeXmrAddress(source);

  const tag = decoded.slice(0, -68);

  if (
    decoded.length < 68 ||
    (!equalBytes(tag, new Uint8Array([0x06])) &&
      !equalBytes(tag, new Uint8Array([0xce, 0xf6, 0x22])))
  )
    throw new Error("Unrecognised address format");

  return bcnChecksum.decode(decoded);
};

export const bcn = {
  name,
  coinType,
  encode: encodeBcnAddress,
  decode: decodeBcnAddress,
} as const satisfies CheckedCoin;
