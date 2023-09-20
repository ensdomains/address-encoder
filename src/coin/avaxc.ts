import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "AVAXC";
const evmChainId = 43114;
const coinType = 2147526762;
  
export const encodeAvaxcAddress = createHexChecksummedEncoder();
export const decodeAvaxcAddress = createHexChecksummedDecoder();
  
export const avaxc = {
  name,
  coinType,
  evmChainId,
  encode: encodeAvaxcAddress,
  decode: decodeAvaxcAddress,
} as const satisfies Coin;