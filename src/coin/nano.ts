import { blake2b } from "@noble/hashes/blake2b";
import { utils, type Coder } from "@scure/base";
import type { CheckedCoin } from "../types.js";

const name = "nano";
const coinType = 165;

const convertRadixNano = (
  data: ArrayLike<number>,
  from: number,
  to: number
) => {
  const leftover = (data.length * from) % to;
  const offset = leftover === 0 ? 0 : to - leftover;

  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res: number[] = [];

  for (let i = 0; i < data.length; i++) {
    const n = data[i];
    if (n >= 2 ** from)
      throw new Error(`convertRadixNano: invalid data word=${n} from=${from}`);
    carry = (carry << from) | n;
    if (pos + from > 32)
      throw new Error(
        `convertRadixNano: carry overflow pos=${pos} from=${from}`
      );
    pos += from;
    for (; pos >= to; pos -= to) {
      res.push((carry >>> (pos + offset - to)) & mask);
    }
  }
  carry = (carry << (to - (pos + offset))) & mask;
  if (pos > 0) res.push(carry >>> 0);
  return res;
};

const radixNano: Coder<Uint8Array, number[]> = {
  encode: (source) => convertRadixNano(source, 8, 5),
  decode: (source) => {
    const leftover = (source.length * 5) % 8;
    let result = convertRadixNano(source, 5, 8);
    if (leftover !== 0) result = result.slice(1);
    return Uint8Array.from(result);
  },
};

const base32Nano = utils.chain(
  radixNano,
  utils.alphabet("13456789abcdefghijkmnopqrstuwxyz"),
  utils.join("")
);

export const encodeNanoAddress = (source: Uint8Array): string => {
  const encoded = base32Nano.encode(source);
  const checksum = blake2b(source, { dkLen: 5 }).reverse();
  const checksumEncoded = base32Nano.encode(checksum);
  return `nano_${encoded}${checksumEncoded}`;
};
export const decodeNanoAddress = (source: string): Uint8Array => {
  const decoded = base32Nano.decode(source.slice(5));
  return Uint8Array.from(decoded.slice(0, -5));
};

export const nano = {
  name,
  coinType,
  encode: encodeNanoAddress,
  decode: decodeNanoAddress,
} as const satisfies CheckedCoin;
