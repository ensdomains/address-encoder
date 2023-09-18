import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "GO";
const evmChainId = 60;
const coinType = 2147483708;
  
export const encodeGoAddress = createHexChecksummedEncoder();
export const decodeGoAddress = createHexChecksummedDecoder();
  
export const go = {
  name,
  coinType,
  evmChainId,
  encode: encodeGoAddress,
  decode: decodeGoAddress,
} as const satisfies Coin;
