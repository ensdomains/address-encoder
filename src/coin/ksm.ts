import { Coin } from "../types";
import { createDotAddressDecoder, createDotAddressEncoder } from "../utils/dot";

const name = "KSM";
const coinType = 434;

const dotType = 2;

export const encodeKsmAddress = createDotAddressEncoder(dotType);
export const decodeKsmAddress = createDotAddressDecoder(dotType);

export const ksm = {
  name,
  coinType,
  encode: encodeKsmAddress,
  decode: decodeKsmAddress,
} as const satisfies Coin;
