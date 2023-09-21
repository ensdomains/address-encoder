import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "theta";
const evmChainId = 361;
const coinType = 2147484009;

export const encodeThetaAddress = createHexChecksummedEncoder();
export const decodeThetaAddress = createHexChecksummedDecoder();

export const theta = {
  name,
  coinType,
  evmChainId,
  encode: encodeThetaAddress,
  decode: decodeThetaAddress,
} as const satisfies Coin;
