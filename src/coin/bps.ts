import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "bps";
const coinType = 576;

const p2pkhVersions = [new Uint8Array([0x00])];
const p2shVersions = [new Uint8Array([0x05])];

export const encodeBpsAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeBpsAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const bps = {
  name,
  coinType,
  encode: encodeBpsAddress,
  decode: decodeBpsAddress,
} as const satisfies CheckedCoin;
