import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "GNO_LEGACY";
const coinType = 700;

export const encodeGnoLegacyAddress = createHexChecksummedEncoder();
export const decodeGnoLegacyAddress = createHexChecksummedDecoder();

export const gnoLegacy = {
  name,
  coinType,
  encode: encodeGnoLegacyAddress,
  decode: decodeGnoLegacyAddress,
} as const satisfies Coin;
