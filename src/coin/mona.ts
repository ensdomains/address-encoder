import { Coin } from "../types";
import { createBitcoinDecoder, createBitcoinEncoder } from "../utils/bitcoin";

const name = "MONA";
const coinType = 22;
const hrp = "mona";

const p2pkhVersions = [[0x32]];
const p2shVersions = [[0x37], [0x05]];

export const encodeMonaAddress = createBitcoinEncoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});
export const decodeMonaAddress = createBitcoinDecoder({
  hrp,
  p2pkhVersions,
  p2shVersions,
});

export const mona = {
  name,
  coinType,
  encode: encodeMonaAddress,
  decode: decodeMonaAddress,
} satisfies Coin;
