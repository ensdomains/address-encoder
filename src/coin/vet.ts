import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "VET";
const coinType = 703;

export const encodeVetAddress = createHexChecksummedEncoder();
export const decodeVetAddress = createHexChecksummedDecoder();

export const vet = {
  name,
  coinType,
  encode: encodeVetAddress,
  decode: decodeVetAddress,
} as const satisfies Coin;
