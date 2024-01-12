import { base32, utils } from "@scure/base";

export const base32Encode = base32.encode;
export const base32Decode = base32.decode;

const base32Unpadded = utils.chain(
  utils.radix2(5),
  utils.alphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"),
  utils.join("")
);
export const base32UnpaddedEncode = base32Unpadded.encode;
export const base32UnpaddedDecode = base32Unpadded.decode;

export const base32CrockfordNormalise = (source: string) =>
  source.toUpperCase().replace(/O/g, "0").replace(/[IL]/g, "1");
