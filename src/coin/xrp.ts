import { Coin } from "../types";
import {
  base58ChecksumDecode,
  base58ChecksumEncode,
  base58DecodeNoCheckUnsafe,
  base58EncodeNoCheck,
  createBase58Options,
} from "../utils/base58";

const name = "XRP";
const coinType = 144;

const xrpBase58Options = createBase58Options(
  "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
);

export const encodeXrpAddress = (source: Uint8Array): string => {
  const checksummed = base58ChecksumEncode(source);
  return base58EncodeNoCheck(checksummed, xrpBase58Options);
};
export const decodeXrpAddress = (source: string): Uint8Array => {
  const decoded = base58DecodeNoCheckUnsafe(source, xrpBase58Options);
  if (!decoded) throw new Error("Invalid address");

  const payload = base58ChecksumDecode(decoded);
  return payload;
};

export const xrp = {
  name,
  coinType,
  encode: encodeXrpAddress,
  decode: decodeXrpAddress,
} as const satisfies Coin;
