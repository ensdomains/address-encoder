import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "CELO";
const evmChainId = 42220;
const coinType = 2147525868;
  
export const encodeCeloAddress = createHexChecksummedEncoder();
export const decodeCeloAddress = createHexChecksummedDecoder();
  
export const celo = {
  name,
  coinType,
  evmChainId,
  encode: encodeCeloAddress,
  decode: decodeCeloAddress,
} as const satisfies Coin;
