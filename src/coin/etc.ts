import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "ETC";
const evmChainId = 61;
const coinType = 2147483709;
  
export const encodeEtcAddress = createHexChecksummedEncoder();
export const decodeEtcAddress = createHexChecksummedDecoder();
  
export const etc = {
  name,
  coinType,
  evmChainId,
  encode: encodeEtcAddress,
  decode: decodeEtcAddress,
} as const satisfies Coin;
