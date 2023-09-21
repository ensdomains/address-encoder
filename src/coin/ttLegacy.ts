import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "ttLegacy";
const coinType = 1001;

export const encodeTtLegacyAddress = createHexChecksummedEncoder();
export const decodeTtLegacyAddress = createHexChecksummedDecoder();

export const ttLegacy = {
  name,
  coinType,
  encode: encodeTtLegacyAddress,
  decode: decodeTtLegacyAddress,
} as const satisfies Coin;
