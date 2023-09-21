import { equals } from "uint8arrays/equals";
import { Coin } from "../types";
import { base58Decode, base58Encode } from "../utils/base58";

const name = "zen";
const coinType = 121;

const validPrefixes = [
  new Uint8Array([0x20, 0x89]), // zn
  new Uint8Array([0x1c, 0xb8]), // t1
  new Uint8Array([0x20, 0x96]), // zs
  new Uint8Array([0x1c, 0xbd]), // t3
  new Uint8Array([0x16, 0x9a]), // zc
];

export const encodeZenAddress = (source: Uint8Array): string => {
  const prefix = source.slice(0, 2);
  if (!validPrefixes.some((x) => equals(x, prefix)))
    throw new Error("Invalid prefix");

  return base58Encode(source);
};
export const decodeZenAddress = (source: string): Uint8Array => {
  const decoded = base58Decode(source);
  const prefix = decoded.slice(0, 2);

  if (!validPrefixes.some((x) => equals(x, prefix)))
    throw new Error("Invalid prefix");

  return decoded;
};

export const zen = {
  name,
  coinType,
  encode: encodeZenAddress,
  decode: decodeZenAddress,
} as const satisfies Coin;
