import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "poaLegacy";
const coinType = 178;

export const encodePoaLegacyAddress = createHexChecksummedEncoder();
export const decodePoaLegacyAddress = createHexChecksummedDecoder();

export const poaLegacy = {
  name,
  coinType,
  encode: encodePoaLegacyAddress,
  decode: decodePoaLegacyAddress,
} as const satisfies Coin;
