import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "divi";
const coinType = 301;

const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0xd])];

export const encodeDiviAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeDiviAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const divi = {
  name,
  coinType,
  encode: encodeDiviAddress,
  decode: decodeDiviAddress,
} as const satisfies CheckedCoin;
