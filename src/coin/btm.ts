import { Coin } from "../types";
import {
  createBech32SegwitDecoder,
  createBech32SegwitEncoder,
} from "../utils/bech32";

const name = "BTM";
const coinType = 153;

const hrp = "bm";

export const encodeBtmAddress = createBech32SegwitEncoder(hrp);
export const decodeBtmAddress = createBech32SegwitDecoder(hrp);

export const btm = {
  name,
  coinType,
  encode: encodeBtmAddress,
  decode: decodeBtmAddress,
} as const satisfies Coin;
