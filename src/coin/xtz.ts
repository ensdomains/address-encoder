import { concatBytes } from "@noble/hashes/utils";
import type { CheckedCoin } from "../types.js";
import { base58CheckDecode, base58CheckEncode } from "../utils/base58.js";

const name = "xtz";
const coinType = 1729;

// Referenced from the followings
// https://tezos.stackexchange.com/questions/183/base58-encoding-decoding-of-addresses-in-micheline
// https://tezos.gitlab.io/api/p2p.html?highlight=contract_id#contract-id-22-bytes-8-bit-tag
export const encodeXtzAddress = (source: Uint8Array): string => {
  if (source.length !== 22 && source.length !== 21)
    throw new Error("Unrecognised address format");

  const version = source[0];
  if (version === 0) {
    let prefix: Uint8Array;
    if (source[1] === 0x00)
      prefix = new Uint8Array([0x06, 0xa1, 0x9f]); // prefix tz1 equal 06a19f
    else if (source[1] === 0x01)
      prefix = new Uint8Array([0x06, 0xa1, 0xa1]); // prefix tz2 equal 06a1a1
    else if (source[1] === 0x02)
      prefix = new Uint8Array([0x06, 0xa1, 0xa4]); // prefix tz3 equal 06a1a4
    else throw new Error("Unrecognised address format");
    return base58CheckEncode(concatBytes(prefix, source.slice(2)));
  }
  if (version === 1) {
    return base58CheckEncode(
      concatBytes(
        new Uint8Array([0x02, 0x5a, 0x79]) /* prefix KT1 equal 025a79 */,
        source.slice(1, 21)
      )
    );
  }
  throw new Error("Unrecognised address format");
};
export const decodeXtzAddress = (source: string): Uint8Array => {
  const decoded = base58CheckDecode(source).slice(3);

  const prefix = source.slice(0, 3);
  if (prefix === "tz1")
    return concatBytes(new Uint8Array([0x00, 0x00]), decoded);
  if (prefix === "tz2")
    return concatBytes(new Uint8Array([0x00, 0x01]), decoded);
  if (prefix === "tz3")
    return concatBytes(new Uint8Array([0x00, 0x02]), decoded);
  if (prefix === "KT1")
    return concatBytes(new Uint8Array([0x01]), decoded, new Uint8Array([0x00]));

  throw new Error("Unrecognised address format");
};

export const xtz = {
  name,
  coinType,
  encode: encodeXtzAddress,
  decode: decodeXtzAddress,
} as const satisfies CheckedCoin;
