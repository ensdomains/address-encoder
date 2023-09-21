import { Coin } from "../types";
import {
  base58Checksum,
  base58DecodeNoCheckUnsafe,
  base58EncodeNoCheck,
  createBase58Options,
} from "../utils/base58";

const name = "xrp";
const coinType = 144;

const xrpBase58Options = createBase58Options(
  "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
);

export const encodeXrpAddress = (source: Uint8Array): string => {
  const checksummed = base58Checksum.encode(source);
  return base58EncodeNoCheck(checksummed, xrpBase58Options);
};
export const decodeXrpAddress = (source: string): Uint8Array => {
  const decoded = base58DecodeNoCheckUnsafe(source, xrpBase58Options);
  if (!decoded) throw new Error("Invalid address");

  const payload = base58Checksum.decode(decoded);
  return payload;
};

export const xrp = {
  name,
  coinType,
  encode: encodeXrpAddress,
  decode: decodeXrpAddress,
} as const satisfies Coin;
