import { equalBytes } from "@noble/curves/abstract/utils";
import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { base32Decode, base32Encode } from "../utils/base32.js";
import { hexWithoutPrefixToBytes } from "../utils/bytes.js";

const name = "xlm";
const coinType = 148;

const versionByte = new Uint8Array([0x30]);

// CRC16-XModem checksum
const xlmChecksum = (source: Uint8Array): Uint8Array => {
  let crc = 0;

  for (let i = 0; i < source.length; i++) {
    const byte = source[i];
    let code = (crc >>> 8) & 0xff;
    code ^= byte & 0xff;
    code ^= code >>> 4;
    crc = (crc << 8) & 0xffff;
    crc ^= code;
    code = (code << 5) & 0xffff;
    crc ^= code;
    code = (code << 7) & 0xffff;
    crc ^= code;
  }

  return hexWithoutPrefixToBytes(crc.toString(16).padStart(4, "0")).reverse();
};

export const encodeXlmAddress = (source: Uint8Array): string => {
  const payload = concatBytes(versionByte, source);
  const checksummed = xlmChecksum(payload);

  const payloadWithChecksum = concatBytes(payload, checksummed);

  return base32Encode(payloadWithChecksum);
};
export const decodeXlmAddress = (source: string): Uint8Array => {
  const decoded = base32Decode(source);
  const version = decoded[0];
  const payload = decoded.slice(0, -2);
  const output = payload.slice(1);
  const checksum = decoded.slice(-2);

  if (version !== versionByte[0])
    throw new Error("Unrecognised address format");

  const newChecksum = xlmChecksum(payload);
  if (!equalBytes(checksum, newChecksum))
    throw new Error("Unrecognised address format");

  return output;
};

export const xlm = {
  name,
  coinType,
  encode: encodeXlmAddress,
  decode: decodeXlmAddress,
} as const satisfies CheckedCoin;
