import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "OP";
const evmChainId = 10;
const coinType = 2147483658;
  
export const encodeOpAddress = createHexChecksummedEncoder();
export const decodeOpAddress = createHexChecksummedDecoder();
  
export const op = {
  name,
  coinType,
  evmChainId,
  encode: encodeOpAddress,
  decode: decodeOpAddress,
} as const satisfies Coin;
