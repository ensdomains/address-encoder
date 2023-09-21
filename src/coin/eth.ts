import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "eth";
const coinType = 60;

export const encodeEthAddress = createHexChecksummedEncoder();
export const decodeEthAddress = createHexChecksummedDecoder();

export const eth = {
  name,
  coinType,
  encode: encodeEthAddress,
  decode: decodeEthAddress,
} as const satisfies Coin;
