import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "tomoLegacy";
const coinType = 889;

export const encodeTomoLegacyAddress = createHexChecksummedEncoder();
export const decodeTomoLegacyAddress = createHexChecksummedDecoder();

export const tomoLegacy = {
  name,
  coinType,
  encode: encodeTomoLegacyAddress,
  decode: decodeTomoLegacyAddress,
} as const satisfies Coin;
