import { sha256 } from "@noble/hashes/sha256";
import { base58xrp, utils } from "@scure/base";
import type { CheckedCoin } from "../types.js";

const name = "xrp";
const coinType = 144;

const base58XrpCheck = utils.chain(
  utils.checksum(4, (data) => sha256(sha256(data))),
  base58xrp
);

export const encodeXrpAddress = base58XrpCheck.encode;
export const decodeXrpAddress = base58XrpCheck.decode;

export const xrp = {
  name,
  coinType,
  encode: encodeXrpAddress,
  decode: decodeXrpAddress,
} as const satisfies CheckedCoin;
