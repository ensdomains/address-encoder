import { sha512_256 } from "@noble/hashes/sha512";
import { utils } from "@scure/base";
import type { CheckedCoin } from "../types.js";
import { base32UnpaddedDecode, base32UnpaddedEncode } from "../utils/base32.js";

const name = "algo";
const coinType = 283;

const algoChecksum = utils.checksum(4, (data) => sha512_256(data).slice(-4));

export const encodeAlgoAddress = (source: Uint8Array): string => {
  const checksum = algoChecksum.encode(source);
  return base32UnpaddedEncode(checksum);
};
export const decodeAlgoAddress = (source: string): Uint8Array => {
  const decoded = base32UnpaddedDecode(source);

  if (decoded.length !== 36) throw new Error("Unrecognised address format");

  return algoChecksum.decode(decoded);
};

export const algo = {
  name,
  coinType,
  encode: encodeAlgoAddress,
  decode: decodeAlgoAddress,
} as const satisfies CheckedCoin;
