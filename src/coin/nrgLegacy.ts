import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "NRG_LEGACY";
const coinType = 9797;

export const encodeNrgLegacyAddress = createHexChecksummedEncoder();
export const decodeNrgLegacyAddress = createHexChecksummedDecoder();

export const nrgLegacy = {
  name,
  coinType,
  encode: encodeNrgLegacyAddress,
  decode: decodeNrgLegacyAddress,
} satisfies Coin;
