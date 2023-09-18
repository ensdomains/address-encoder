import { Coin } from "../types";
import { bs58DecodeNoCheck, bs58EncodeNoCheck } from "../utils/bs58";

const name = "XMR";
const coinType = 128;

const blockLengths = [0, 2, 3, 5, 6, 7, 9, 10, 11];

export const encodeXmrAddress = (source: Uint8Array): string => {
  let encoded = "";
  for (let i = 0; i < source.length; i += 8) {
    const block = source.subarray(i, i + 8);
    encoded += bs58EncodeNoCheck(block).padStart(
      blockLengths[block.length],
      "1"
    );
  }
  return encoded;
};
export const decodeXmrAddress = (source: string): Uint8Array => {
  let decoded: number[] = [];
  for (let i = 0; i < source.length; i += 11) {
    const slice = source.slice(i, i + 11);
    const blockLength = blockLengths.indexOf(slice.length);
    const block = bs58DecodeNoCheck(slice);
    for (let j = 0; j < block.length - blockLength; j++) {
      if (block[j] !== 0) throw new Error("Invalid padding");
    }
    decoded = decoded.concat(
      Array.from(block.slice(block.length - blockLength))
    );
  }
  return new Uint8Array(decoded);
};

export const xmr = {
  name,
  coinType,
  encode: encodeXmrAddress,
  decode: decodeXmrAddress,
} satisfies Coin;
