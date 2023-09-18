import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "EWT";
const evmChainId = 246;
const coinType = 2147483894;
  
export const encodeEwtAddress = createHexChecksummedEncoder();
export const decodeEwtAddress = createHexChecksummedDecoder();
  
export const ewt = {
  name,
  coinType,
  evmChainId,
  encode: encodeEwtAddress,
  decode: decodeEwtAddress,
} as const satisfies Coin;
