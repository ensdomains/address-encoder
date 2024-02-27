import { concatBytes } from "@noble/hashes/utils";
import { bech32, bech32m } from "@scure/base";

type BechLib = typeof bech32 | typeof bech32m;

type Bech32Parameters = {
  bechLib: BechLib;
  hrp: string;
  limit?: number;
};

const createInternalBech32Encoder =
  ({ bechLib, hrp, limit }: Bech32Parameters) =>
  (source: Uint8Array): string => {
    return bechLib.encode(hrp, bechLib.toWords(source), limit);
  };

const createInternalBech32Decoder =
  ({ bechLib, hrp, limit }: Bech32Parameters) =>
  (source: string): Uint8Array => {
    const { prefix, words } = bechLib.decode(source, limit);
    if (prefix !== hrp) {
      throw new Error(
        "Unexpected human-readable part in bech32 encoded address"
      );
    }
    return new Uint8Array(bechLib.fromWords(words));
  };

export const createBech32Encoder = (hrp: string, limit?: number) =>
  createInternalBech32Encoder({ hrp, bechLib: bech32, limit });
export const createBech32Decoder = (hrp: string, limit?: number) =>
  createInternalBech32Decoder({ hrp, bechLib: bech32, limit });

export const createBech32mEncoder = (hrp: string, limit?: number) =>
  createInternalBech32Encoder({ hrp, bechLib: bech32m, limit });
export const createBech32mDecoder = (hrp: string, limit?: number) =>
  createInternalBech32Decoder({ hrp, bechLib: bech32m, limit });

export const createBech32SegwitEncoder =
  (hrp: string) =>
  (source: Uint8Array): string => {
    let version = source[0];
    if (version >= 0x51 && version <= 0x60) {
      version -= 0x50;
    } else if (version !== 0x00) {
      throw new Error("Unrecognised address format");
    }
    let words: number[] = [];
    if (version > 0 && version < 17) {
      words = [version].concat(bech32m.toWords(source.slice(2, source[1] + 2)));
      return bech32m.encode(hrp, words);
    }
    words = [version].concat(bech32.toWords(source.slice(2, source[1] + 2)));
    return bech32.encode(hrp, words);
  };

export const createBech32SegwitDecoder =
  (hrp: string) =>
  (source: string): Uint8Array => {
    const decodedObj =
      bech32.decodeUnsafe(source) || bech32m.decodeUnsafe(source);

    if (!decodedObj) throw new Error("Unrecognised address format");
    const { prefix, words } = decodedObj;

    if (prefix !== hrp)
      throw new Error(
        "Unexpected human-readable part in bech32 encoded address"
      );

    const script = bech32.fromWords(words.slice(1));
    let version = words[0];
    if (version > 0) {
      version += 0x50;
    }

    return concatBytes(
      new Uint8Array([version, script.length]),
      new Uint8Array(script)
    );
  };
