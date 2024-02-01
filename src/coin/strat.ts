import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "strat";
const coinType = 105;

const p2pkhVersions = [new Uint8Array([0x3f])];
const p2shVersions = [new Uint8Array([0x7d])];

export const encodeStratAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeStratAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const strat = {
  name,
  coinType,
  encode: encodeStratAddress,
  decode: decodeStratAddress,
} as const satisfies CheckedCoin;
