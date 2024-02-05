import type { CheckedCoin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "rbtc";
const coinType = 137;

const chainId = 30;

export const encodeRbtcAddress = createHexChecksummedEncoder(chainId);
export const decodeRbtcAddress = createHexChecksummedDecoder(chainId);

export const rbtc = {
  name,
  coinType,
  encode: encodeRbtcAddress,
  decode: decodeRbtcAddress,
} as const satisfies CheckedCoin;
