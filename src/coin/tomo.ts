import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "TOMO";
const evmChainId = 88;
const coinType = 2147483736;
  
export const encodeTomoAddress = createHexChecksummedEncoder();
export const decodeTomoAddress = createHexChecksummedDecoder();
  
export const tomo = {
  name,
  coinType,
  evmChainId,
  encode: encodeTomoAddress,
  decode: decodeTomoAddress,
} as const satisfies Coin;
