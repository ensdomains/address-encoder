import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "ETC_LEGACY";
const coinType = 61;

export const encodeEtcLegacyAddress = createHexChecksummedEncoder();
export const decodeEtcLegacyAddress = createHexChecksummedDecoder();

export const etcLegacy = {
  name,
  coinType,
  encode: encodeEtcLegacyAddress,
  decode: decodeEtcLegacyAddress,
} as const satisfies Coin;
