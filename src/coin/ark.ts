import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

const name = "ark";
const coinType = 111;

export const encodeArkAddress = base58Encode;
export const decodeArkAddress = (source: string): Uint8Array => {
  const decoded = base58Decode(source);
  if (decoded[0] !== 23) throw new Error("Invalid address");
  return decoded;
};

export const ark = {
  name,
  coinType,
  encode: encodeArkAddress,
  decode: decodeArkAddress,
} as const satisfies Coin;
