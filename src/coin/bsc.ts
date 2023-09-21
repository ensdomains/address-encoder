import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "bsc";
const evmChainId = 56;
const coinType = 2147483704;

export const encodeBscAddress = createHexChecksummedEncoder();
export const decodeBscAddress = createHexChecksummedDecoder();

export const bsc = {
  name,
  coinType,
  evmChainId,
  encode: encodeBscAddress,
  decode: decodeBscAddress,
} as const satisfies Coin;
