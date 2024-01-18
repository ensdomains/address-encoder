import { equalBytes } from "@noble/curves/abstract/utils";
import { sha256 } from "@noble/hashes/sha256";
import { concatBytes } from "@noble/hashes/utils";
import { utils, type Coder } from "@scure/base";
import type { CheckedCoin } from "../types.js";
import { base32CrockfordNormalise } from "../utils/base32.js";

const name = "stx";
const coinType = 5757;

const prefix = "S";
const length = 20;
const checkumLength = 4;
const p2pkhVersion = new Uint8Array([22]);
const p2shVersion = new Uint8Array([20]);

const radixStx: Coder<Uint8Array, number[]> = {
  encode: (source) => convertRadixStx(source, 8, 5, true),
  decode: (source) => Uint8Array.from(convertRadixStx(source, 5, 8, false)),
};

const convertRadixStx = (
  data: Uint8Array | number[],
  from: number,
  to: number,
  padding: boolean
): number[] => {
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res: number[] = [];
  for (const n of data.reverse()) {
    carry = (n << pos) | carry;
    pos += from;
    let i = 0;
    for (; pos >= to; pos -= to) {
      const v = ((carry >> (to * i)) & mask) >>> 0;
      res.unshift(v);
      i += 1;
    }
    carry = carry >> (to * i);
  }
  if (!padding && pos >= from) throw new Error("Excess padding");
  if (!padding && carry) throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0) res.unshift(carry >>> 0);
  return res;
};

const base32Stx = utils.chain(
  radixStx,
  utils.alphabet("0123456789ABCDEFGHJKMNPQRSTVWXYZ"),
  utils.join("")
);

const stxChecksum = (data: Uint8Array): Uint8Array =>
  sha256(sha256(data)).slice(0, checkumLength);

export const encodeStxAddress = (source: Uint8Array): string => {
  if (source.length !== length + checkumLength)
    throw new Error("Unrecognised address format");
  const hash160 = source.slice(0, length);
  const checksum = source.slice(-checkumLength);

  let version: string;
  let encoded: string;

  if (equalBytes(checksum, stxChecksum(concatBytes(p2pkhVersion, hash160)))) {
    version = "P";
    encoded = base32Stx.encode(source);
  } else if (
    equalBytes(checksum, stxChecksum(concatBytes(p2shVersion, hash160)))
  ) {
    version = "M";
    encoded = base32Stx.encode(source);
  } else throw new Error("Unrecognised address format");

  return `${prefix}${version}${encoded}`;
};
export const decodeStxAddress = (source: string): Uint8Array => {
  if (source.length < 6) throw new Error("Unrecognised address format");
  if (source[0] !== "S") throw new Error("Unrecognised address format");

  const normalised = base32CrockfordNormalise(source);

  const version = normalised[1];
  let versionBytes: Uint8Array;
  if (version === "P") versionBytes = p2pkhVersion;
  else if (version === "M") versionBytes = p2shVersion;
  else throw new Error("Unrecognised address format");

  const payload = base32Stx.decode(normalised.slice(2));
  const decoded = payload.slice(0, -checkumLength);
  const checksum = payload.slice(-checkumLength);
  const newChecksum = stxChecksum(concatBytes(versionBytes, decoded));

  if (!equalBytes(checksum, newChecksum))
    throw new Error("Unrecognised address format");

  return payload;
};

export const stx = {
  name,
  coinType,
  encode: encodeStxAddress,
  decode: decodeStxAddress,
} as const satisfies CheckedCoin;
