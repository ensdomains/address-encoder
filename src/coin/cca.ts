import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "cca";
const coinType = 489;

const p2pkhVersions = [new Uint8Array([0x0b])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeCcaAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeCcaAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const cca = {
  name,
  coinType,
  encode: encodeCcaAddress,
  decode: decodeCcaAddress,
} as const satisfies CheckedCoin;
