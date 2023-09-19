import {
  Base58CheckVersion,
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "./base58";
import { createBech32SegwitDecoder, createBech32SegwitEncoder } from "./bech32";

export type BitcoinCoderParameters = {
  hrp: string;
  p2pkhVersions: Base58CheckVersion[];
  p2shVersions: Base58CheckVersion[];
};

export const createBitcoinDecoder = ({
  hrp,
  p2pkhVersions,
  p2shVersions,
}: BitcoinCoderParameters) => {
  const decodeBech32 = createBech32SegwitDecoder(hrp);
  const decodeBase58 = createBase58WithCheckDecoder(
    p2pkhVersions,
    p2shVersions
  );
  return (source: string): Uint8Array => {
    if (source.toLowerCase().startsWith(hrp + "1")) {
      return decodeBech32(source);
    }
    return decodeBase58(source);
  };
};

export const createBitcoinEncoder = ({
  hrp,
  p2pkhVersions,
  p2shVersions,
}: BitcoinCoderParameters) => {
  const encodeBech32 = createBech32SegwitEncoder(hrp);
  const encodeBase58 = createBase58WithCheckEncoder(
    p2pkhVersions[0],
    p2shVersions[0]
  );
  return (source: Uint8Array): string => {
    try {
      return encodeBase58(source);
    } catch {
      return encodeBech32(source);
    }
  };
};
