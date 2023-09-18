import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "TOMO_LEGACY";
const coinType = 889;

export const encodeTomoLegacyAddress = createHexChecksummedEncoder();
export const decodeTomoLegacyAddress = createHexChecksummedDecoder();

export const tomoLegacy = {
  name,
  coinType,
  encode: encodeTomoLegacyAddress,
  decode: decodeTomoLegacyAddress,
} satisfies Coin;
