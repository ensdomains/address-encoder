import { Coin } from "../types";
import { createDotAddressDecoder, createDotAddressEncoder } from "../utils/dot";

const name = "DOT";
const coinType = 354;

const dotType = 0;

export const encodeDotAddress = createDotAddressEncoder(dotType);
export const decodeDotAddress = createDotAddressDecoder(dotType);

export const dot = {
  name,
  coinType,
  encode: encodeDotAddress,
  decode: decodeDotAddress,
} as const satisfies Coin;
