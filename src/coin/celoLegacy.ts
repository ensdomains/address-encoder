import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "CELO_LEGACY";
const coinType = 52752;

export const encodeCeloLegacyAddress = createHexChecksummedEncoder();
export const decodeCeloLegacyAddress = createHexChecksummedDecoder();

export const celoLegacy = {
  name,
  coinType,
  encode: encodeCeloLegacyAddress,
  decode: decodeCeloLegacyAddress,
} as const satisfies Coin;
