import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "THETA_LEGACY";
const coinType = 500;

export const encodeThetaLegacyAddress = createHexChecksummedEncoder();
export const decodeThetaLegacyAddress = createHexChecksummedDecoder();

export const thetaLegacy = {
  name,
  coinType,
  encode: encodeThetaLegacyAddress,
  decode: decodeThetaLegacyAddress,
} as const satisfies Coin;
