import { sha512_256 } from "@noble/hashes/sha512";
import { utils } from "@scure/base";
import { Coin } from "../types";
import {
  base32Decode,
  base32Encode,
  unpaddedBase32Options,
} from "../utils/base32";

const name = "algo";
const coinType = 283;

const algoChecksum = utils.checksum(4, (data) => sha512_256(data).slice(-4));

export const encodeAlgoAddress = (source: Uint8Array): string => {
  const checksum = algoChecksum.encode(source);
  return base32Encode(checksum, unpaddedBase32Options);
};
export const decodeAlgoAddress = (source: string): Uint8Array => {
  const decoded = base32Decode(source, unpaddedBase32Options);

  if (decoded.length !== 36) throw new Error("Unrecognised address format");

  return algoChecksum.decode(decoded);
};

export const algo = {
  name,
  coinType,
  encode: encodeAlgoAddress,
  decode: decodeAlgoAddress,
} as const satisfies Coin;
