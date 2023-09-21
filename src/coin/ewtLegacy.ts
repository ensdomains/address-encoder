import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "ewtLegacy";
const coinType = 246;

export const encodeEwtLegacyAddress = createHexChecksummedEncoder();
export const decodeEwtLegacyAddress = createHexChecksummedDecoder();

export const ewtLegacy = {
  name,
  coinType,
  encode: encodeEwtLegacyAddress,
  decode: decodeEwtLegacyAddress,
} as const satisfies Coin;
