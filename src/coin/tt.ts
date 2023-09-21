import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "tt";
const evmChainId = 108;
const coinType = 2147483756;

export const encodeTtAddress = createHexChecksummedEncoder();
export const decodeTtAddress = createHexChecksummedDecoder();

export const tt = {
  name,
  coinType,
  evmChainId,
  encode: encodeTtAddress,
  decode: decodeTtAddress,
} as const satisfies Coin;
