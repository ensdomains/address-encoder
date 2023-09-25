import type { Coin } from "../types.js";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex.js";

const name = "rsk";
const coinType = 137;

const chainId = 30;

export const encodeRskAddress = createHexChecksummedEncoder(chainId);
export const decodeRskAddress = createHexChecksummedDecoder(chainId);

export const rsk = {
  name,
  coinType,
  encode: encodeRskAddress,
  decode: decodeRskAddress,
} as const satisfies Coin;
