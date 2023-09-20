import { Coin } from "../types";
import { bytesToHex, hexWithoutPrefixToBytes } from "../utils/bytes";
import { validateFlowAddress } from "../utils/flow";

const name = "FLOW";
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
} as const satisfies Coin;
