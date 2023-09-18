import { concat } from "uint8arrays";
import { Coin } from "../types";
import {
  bytesToHexWithoutPrefix,
  hexWithoutPrefixToBytes,
} from "../utils/bytes";

const name = "ICX";
const coinType = 74;

export const encodeIcxAddress = (source: Uint8Array): string => {
  if (source.length !== 21) throw new Error("Invalid address length");

  const type = source[0];
  if (type === 0x00) return `hx${bytesToHexWithoutPrefix(source.slice(1))}`;
  if (type === 0x01) return `cx${bytesToHexWithoutPrefix(source.slice(1))}`;
  throw new Error("Invalid address type");
};
export const decodeIcxAddress = (source: string): Uint8Array => {
  const prefix = source.slice(0, 2);
  const body = source.slice(2);
  if (prefix === "hx") return concat([[0x00], hexWithoutPrefixToBytes(body)]);
  if (prefix === "cx") return concat([[0x01], hexWithoutPrefixToBytes(body)]);
  throw new Error("Invalid address prefix");
};

export const icx = {
  name,
  coinType,
  encode: encodeIcxAddress,
  decode: decodeIcxAddress,
} as const satisfies Coin;
