import type { CheckedCoin } from "../types.js";
import { bytesToHex, hexWithoutPrefixToBytes } from "../utils/bytes.js";
import { validateFlowAddress } from "../utils/flow.js";

const name = "flow";
const coinType = 539;

const addressLength = 8;

export const encodeFlowAddress = (source: Uint8Array): string => {
  let bytes = new Uint8Array(addressLength);
  if (source.length > addressLength) {
    bytes.set(source.slice(source.length - addressLength));
  } else {
    bytes.set(source, addressLength - source.length);
  }

  return bytesToHex(bytes).toLowerCase();
};
export const decodeFlowAddress = (source: string): Uint8Array => {
  if (!validateFlowAddress(BigInt(source)))
    throw new Error("Unrecognised address format");
  return hexWithoutPrefixToBytes(
    source.startsWith("0x") ? source.slice(2) : source
  );
};

export const flow = {
  name,
  coinType,
  encode: encodeFlowAddress,
  decode: decodeFlowAddress,
} as const satisfies CheckedCoin;
