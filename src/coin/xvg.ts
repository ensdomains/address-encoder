import type { CheckedCoin } from "../types.js";
import {
  createBase58VersionedDecoder,
  createBase58VersionedEncoder,
} from "../utils/base58.js";

const name = "xvg";
const coinType = 77;

const p2pkhVersions = [new Uint8Array([0x1e])];
const p2shVersions = [new Uint8Array([0x21])];

export const encodeXvgAddress = createBase58VersionedEncoder(
  p2pkhVersions[0],
  p2shVersions[0]
);
export const decodeXvgAddress = createBase58VersionedDecoder(
  p2pkhVersions,
  p2shVersions
);

export const xvg = {
  name,
  coinType,
  encode: encodeXvgAddress,
  decode: decodeXvgAddress,
} as const satisfies CheckedCoin;
