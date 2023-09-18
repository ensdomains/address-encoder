import { Coin } from "../types";
import { bs58Decode, bs58Encode } from "../utils/bs58";

const name = "ARK";
const coinType = 111;

export const encodeArkAddress = bs58Encode;
export const decodeArkAddress = (source: string): Uint8Array => {
  const decoded = bs58Decode(source);
  if (decoded[0] !== 23) throw new Error("Invalid address");
  return decoded;
};

export const ark = {
  name,
  coinType,
  encode: encodeArkAddress,
  decode: decodeArkAddress,
} as const satisfies Coin;
