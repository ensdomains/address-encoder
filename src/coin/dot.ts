import type { CheckedCoin } from "../types.js";
import {
  createDotAddressDecoder,
  createDotAddressEncoder,
} from "../utils/dot.js";

const name = "dot";
const coinType = 354;

const dotType = 0;

export const encodeDotAddress = createDotAddressEncoder(dotType);
export const decodeDotAddress = createDotAddressDecoder(dotType);

export const dot = {
  name,
  coinType,
  encode: encodeDotAddress,
  decode: decodeDotAddress,
} as const satisfies CheckedCoin;
