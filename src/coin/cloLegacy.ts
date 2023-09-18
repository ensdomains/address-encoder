import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "CLO_LEGACY";
const coinType = 820;

export const encodeCloLegacyAddress = createHexChecksummedEncoder();
export const decodeCloLegacyAddress = createHexChecksummedDecoder();

export const cloLegacy = {
  name,
  coinType,
  encode: encodeCloLegacyAddress,
  decode: decodeCloLegacyAddress,
} satisfies Coin;
