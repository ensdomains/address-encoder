import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "ftmLegacy";
const coinType = 1007;

export const encodeFtmLegacyAddress = createHexChecksummedEncoder();
export const decodeFtmLegacyAddress = createHexChecksummedDecoder();

export const ftmLegacy = {
  name,
  coinType,
  encode: encodeFtmLegacyAddress,
  decode: decodeFtmLegacyAddress,
} as const satisfies Coin;
