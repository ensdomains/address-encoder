import type { CheckedCoin } from "../types.js";

const name = "ardr";
const coinType = 16754;

const prefix = "ARDOR";
const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const codewordMap = new Uint8Array([
  3, 2, 1, 0, 7, 6, 5, 4, 13, 14, 15, 16, 12, 8, 9, 10, 11,
]);

const glog = [
  0, 0, 1, 18, 2, 5, 19, 11, 3, 29, 6, 27, 20, 8, 12, 23, 4, 10, 30, 17, 7, 22,
  28, 26, 21, 25, 9, 16, 13, 14, 24, 15,
];
const gexp = [
  1, 2, 4, 8, 16, 5, 10, 20, 13, 26, 17, 7, 14, 28, 29, 31, 27, 19, 3, 6, 12,
  24, 21, 15, 30, 25, 23, 11, 22, 9, 18, 1,
];
const gmult = (a: number, b: number): number => {
  if (a === 0 || b === 0) return 0;
  return gexp[(glog[a] + glog[b]) % 31];
};

const ardrChecksum = (source: Uint8Array): boolean => {
  let sum = 0;

  for (let i = 1; i < 5; i++) {
    let t = 0;
    for (let j = 0; j < 31; j++) {
      if (j > 12 && j < 27) continue;

      let pos = j;
      if (j > 26) pos -= 14;

      t ^= gmult(source[pos], gexp[(i * j) % 31]);
    }
    sum |= t;
  }
  return sum === 0;
};

export const encodeArdrAddress = (source: Uint8Array): string => {
  const chars: string[] = [];

  for (let i = 0, j = 0; i < source.length; i++) {
    const byte = source[i];
    const writeIndex = codewordMap[j++];
    chars[writeIndex] = alphabet[16 * ((byte & 0xf0) >> 4) + (byte & 0x0f)];
  }

  return `${prefix}-${chars.slice(0, 4).join("")}-${chars
    .slice(4, 8)
    .join("")}-${chars.slice(8, 12).join("")}-${chars.slice(12, 17).join("")}`;
};
export const decodeArdrAddress = (source: string): Uint8Array => {
  if (!source.startsWith(`${prefix}-`) || source.length !== 26)
    throw new Error("Unrecognised address format");

  const joined = source.slice(6);
  const codeword = new Uint8Array([
    1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);

  let dashCount = 0;
  for (let i = 0, j = 0; i < 20; i++) {
    const char = joined[i];
    if (char === "-") {
      dashCount++;
      continue;
    }

    const pos = alphabet.indexOf(char);
    if (pos === -1) throw new Error("Unrecognised address format");

    const writeIndex = codewordMap[j++];
    codeword[writeIndex] = pos;
  }

  if (!ardrChecksum(codeword)) throw new Error("Unrecognised address format");

  return codeword;
};

export const ardr = {
  name,
  coinType,
  encode: encodeArdrAddress,
  decode: decodeArdrAddress,
} as const satisfies CheckedCoin;
