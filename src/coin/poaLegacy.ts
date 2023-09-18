import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "POA_LEGACY";
const coinType = 178;

export const encodePoaLegacyAddress = createHexChecksummedEncoder();
export const decodePoaLegacyAddress = createHexChecksummedDecoder();

export const poaLegacy = {
  name,
  coinType,
  encode: encodePoaLegacyAddress,
  decode: decodePoaLegacyAddress,
} satisfies Coin;
