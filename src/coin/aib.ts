import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "aib";
const coinType = 55;

const p2pkhVersions = [new Uint8Array([0x17])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeAibAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeAibAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const aib = {
  name,
  coinType,
  encode: encodeAibAddress,
  decode: decodeAibAddress,
} as const satisfies CheckedCoin;
