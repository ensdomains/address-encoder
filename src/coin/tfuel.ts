import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";

const name = "TFUEL";
const coinType = 589;

export const encodeTfuelAddress = createHexChecksummedEncoder();
export const decodeTfuelAddress = createHexChecksummedDecoder();

export const tfuel = {
  name,
  coinType,
  encode: encodeTfuelAddress,
  decode: decodeTfuelAddress,
} satisfies Coin;
