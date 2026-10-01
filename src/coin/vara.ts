import type { CheckedCoin } from "../types.js";
import {
  createDotAddressDecoder,
  createDotAddressEncoder,
} from "../utils/dot.js";

const name = "vara";
const coinType = 913;

const varaType = 137;

export const encodeVaraAddress = createDotAddressEncoder(varaType);
export const decodeVaraAddress = createDotAddressDecoder(varaType);

export const vara = {
  name,
  coinType,
  encode: encodeVaraAddress,
  decode: decodeVaraAddress,
} as const satisfies CheckedCoin;
