import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "goLegacy";
const coinType = 6060;

export const encodeGoLegacyAddress = createHexChecksummedEncoder();
export const decodeGoLegacyAddress = createHexChecksummedDecoder();

export const goLegacy = {
  name,
  coinType,
  encode: encodeGoLegacyAddress,
  decode: decodeGoLegacyAddress,
} as const satisfies Coin;
