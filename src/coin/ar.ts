import { Coin } from "../types";
import { base64Decode, base64Encode } from "../utils/base64";

const name = "AR";
const coinType = 472;

const encodeReplaceRegex = /\+|\/|\=/g;
const decodeReplaceRegex = /\-|\_/g;

export const encodeArAddress = (source: Uint8Array): string => {
  return base64Encode(source).replace(encodeReplaceRegex, (match) => {
    if (match === "+") return "-";
    if (match === "/") return "_";
    return "";
  });
};
export const decodeArAddress = (source: string): Uint8Array => {
  const restoredBase64 =
    source.replace(decodeReplaceRegex, (match) => {
      if (match === "-") return "+";
      return "/";
    }) + "=".repeat((4 - (source.length % 4)) % 4);
  return base64Decode(restoredBase64);
};

export const ar = {
  name,
  coinType,
  encode: encodeArAddress,
  decode: decodeArAddress,
} as const satisfies Coin;
