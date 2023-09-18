import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "TT_LEGACY";
const coinType = 1001;

export const encodeTtLegacyAddress = createHexChecksummedEncoder();
export const decodeTtLegacyAddress = createHexChecksummedDecoder();

export const ttLegacy = {
  name,
  coinType,
  encode: encodeTtLegacyAddress,
  decode: decodeTtLegacyAddress,
} satisfies Coin;
