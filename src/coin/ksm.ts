import type { CheckedCoin } from "../types.js";
import {
  createDotAddressDecoder,
  createDotAddressEncoder,
} from "../utils/dot.js";

const name = "ksm";
const coinType = 434;

const dotType = 2;

export const encodeKsmAddress = createDotAddressEncoder(dotType);
export const decodeKsmAddress = createDotAddressDecoder(dotType);

export const ksm = {
  name,
  coinType,
  encode: encodeKsmAddress,
  decode: decodeKsmAddress,
} as const satisfies CheckedCoin;
