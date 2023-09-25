import type { Coin } from "../types.js";
import {
  base32Decode,
  base32Encode,
  createBase32Options,
} from "../utils/base32.js";

const name = "nim";
const coinType = 242;

const nimBase32Options = createBase32Options({
  alphabet: "0123456789ABCDEFGHJKLMNPQRSTUVXY",
});

const CCODE = "NQ";

const ibanCheck = (data: string): number => {
  const num = data
    .toUpperCase()
    .split("")
    .map((c) => {
      const code = c.charCodeAt(0);
      if (code >= 48 && code <= 57) {
        return c;
      } else {
        return (code - 55).toString();
      }
    })
    .join("");

  let tmp = "";
  for (let i = 0; i < Math.ceil(num.length / 6); i++) {
    const a = num.slice(i * 6, i * 6 + 6);
    tmp = (parseInt(tmp + a, 10) % 97).toString();
  }

  return parseInt(tmp, 10);
};

const nimChecksum = (source: string): string => {
  return ("00" + (98 - ibanCheck(source + CCODE + "00"))).slice(-2);
};

export const encodeNimAddress = (source: Uint8Array): string => {
  const base32Part = base32Encode(source, nimBase32Options);
  const checksummed = nimChecksum(base32Part);
  return `${CCODE}${checksummed}${base32Part}`.replace(/.{4}/g, "$& ").trim();
};
export const decodeNimAddress = (source: string): Uint8Array => {
  if (!source.startsWith(CCODE)) throw new Error("Unrecognised address format");

  const noWhitespace = source.replace(/ /g, "");
  const checksum = noWhitespace.slice(2, 4);
  const base32Part = noWhitespace.slice(4);

  if (checksum !== nimChecksum(base32Part))
    throw new Error("Unrecognised address format");

  return base32Decode(base32Part, nimBase32Options);
};

export const nim = {
  name,
  coinType,
  encode: encodeNimAddress,
  decode: decodeNimAddress,
} as const satisfies Coin;
