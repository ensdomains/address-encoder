import { concatBytes } from "@noble/hashes/utils";
import { utils } from "@scure/base";

const prefix = "bitcoincash";
const prefixBytes = new Uint8Array([2, 9, 20, 3, 15, 9, 14, 3, 1, 19, 8, 0]); // bitcoincash + 0x00
const hashSize = [160, 192, 224, 256, 320, 384, 448, 512];
const hashSizeLookup = Object.fromEntries(
  hashSize.map((size, index) => [size, index])
);
const radix5 = utils.radix2(5);
const bchBase32 = utils.chain(
  utils.alphabet("qpzry9x8gf2tvdw0s3jn54khce6mua7l"),
  utils.join("")
);

const checksumToUint5Array = (checksum: bigint): Uint8Array => {
  const result = new Uint8Array(8);
  for (let i = 0; i < 8; i++) {
    result[7 - i] = Number(checksum & 31n);
    checksum = checksum >> 5n;
  }
  return result;
};

const polymod = (data: Uint8Array): bigint => {
  const GENERATOR = [
    0x98f2bc8e61n,
    0x79b76d99e2n,
    0xf33e5fb3c4n,
    0xae2eabe2a8n,
    0x1e4f43e470n,
  ];
  let checksum = 1n;
  for (var i = 0; i < data.length; ++i) {
    const value = data[i];
    const topBits = checksum >> 35n;
    checksum = ((checksum & 0x07ffffffffn) << 5n) ^ BigInt(value);
    for (var j = 0; j < GENERATOR.length; ++j) {
      if (((topBits >> BigInt(j)) & 1n) === 1n) {
        checksum = checksum ^ GENERATOR[j];
      }
    }
  }
  return checksum ^ 1n;
};

const normaliseBchAddress = (str: string): string => {
  const lowercased = str.toLowerCase();
  if (str === lowercased) return lowercased;
  const uppercased = str.toUpperCase();
  if (str === uppercased) return lowercased;
  throw new Error("Unrecognised address format");
};

const isChecksumValid = (source: number[]): boolean => {
  const checksumData = concatBytes(prefixBytes, new Uint8Array(source));
  return polymod(checksumData) === 0n;
};

export const encodeBchAddressWithVersion = (
  version: number,
  source: Uint8Array
): string => {
  const versionByte = new Uint8Array([
    version + hashSizeLookup[source.length * 8],
  ]);
  const radix5Encoded = radix5.encode(concatBytes(versionByte, source));
  const payloadData = new Uint8Array(radix5Encoded);
  const checksumData = concatBytes(prefixBytes, payloadData, new Uint8Array(8));
  const checksum = checksumToUint5Array(polymod(checksumData));
  const payload = concatBytes(payloadData, checksum);

  return `${prefix}:${bchBase32.encode(Array.from(payload))}`;
};

export const decodeBchAddressToTypeAndHash = (
  source: string
): { type: number; hash: number[] } => {
  const normalised = normaliseBchAddress(source);
  let [prefix, payload] = normalised.split(":");
  if (!payload) payload = prefix;
  else if (prefix !== "bitcoincash")
    throw new Error("Unrecognised address format");

  const base32Decoded = bchBase32.decode(payload);
  if (!isChecksumValid(base32Decoded)) throw new Error("Invalid checksum");

  const [versionByte, ...hash] = radix5.decode(
    Array.from(base32Decoded.slice(0, -8))
  );
  if (hashSize[versionByte & 7] !== hash.length * 8)
    throw new Error("Unrecognised address format");

  const type = versionByte & 120;
  return {
    type,
    hash,
  };
};
