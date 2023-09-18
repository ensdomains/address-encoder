import { createBech32Decoder, createBech32Encoder } from "./bech32";
import { BitcoinCoderParameters } from "./bitcoin";
import {
  createBase58WithCheckDecoder,
  createBase58WithCheckEncoder,
} from "./bs58";

// changes from bitcoin.ts:
// - no hrp suffix (hrp + "1")
// - no segwit

export const createZcashDecoder = ({
  hrp,
  p2pkhVersions,
  p2shVersions,
}: BitcoinCoderParameters) => {
  const decodeBech32 = createBech32Decoder(hrp);
  const decodeBase58 = createBase58WithCheckDecoder(
    p2pkhVersions,
    p2shVersions
  );
  return (source: string): Uint8Array => {
    if (source.toLowerCase().startsWith(hrp)) {
      return decodeBech32(source);
    }
    return decodeBase58(source);
  };
};

export const createZcashEncoder = ({
  hrp,
  p2pkhVersions,
  p2shVersions,
}: BitcoinCoderParameters) => {
  const encodeBech32 = createBech32Encoder(hrp);
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
