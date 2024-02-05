import type { CheckedCoin } from "../types.js";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32.js";

const name = "iotx";
const coinType = 304;

const hrp = "io";

export const encodeIotxAddress = createBech32Encoder(hrp);
export const decodeIotxAddress = createBech32Decoder(hrp);

export const iotx = {
  name,
  coinType,
  encode: encodeIotxAddress,
  decode: decodeIotxAddress,
} as const satisfies CheckedCoin;
