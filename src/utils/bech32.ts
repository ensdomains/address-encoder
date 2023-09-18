import { bech32 } from "bech32";
import { concat } from "uint8arrays/concat";

export const createBech32Encoder =
  (hrp: string) =>
  (source: Uint8Array): string => {
    return bech32.encode(hrp, bech32.toWords(source));
  };

export const createBech32Decoder =
  (hrp: string) =>
  (source: string): Uint8Array => {
    const { prefix, words } = bech32.decode(source);
    if (prefix !== hrp) {
      throw Error("Unexpected human-readable part in bech32 encoded address");
    }
    return Uint8Array.of(...bech32.fromWords(words));
  };

export const createBech32SegwitEncoder =
  (hrp: string) =>
  (source: Uint8Array): string => {
    let version = source[0];
    if (version >= 0x51 && version <= 0x60) {
      version -= 0x50;
    } else if (version !== 0x00) {
      throw Error("Unrecognised address format");
    }

    const words = [version].concat(
      bech32.toWords(source.slice(2, source[1] + 2))
    );
    return bech32.encode(hrp, words);
  };

export const createBech32SegwitDecoder =
  (hrp: string) =>
  (source: string): Uint8Array => {
    const { prefix, words } = bech32.decode(source);
    if (prefix !== hrp) {
      throw Error("Unexpected human-readable part in bech32 encoded address");
    }
    const script = bech32.fromWords(words.slice(1));
    let version = words[0];
    if (version > 0) {
      version += 0x50;
    }
    return concat([Uint8Array.of(version, script.length), Buffer.from(script)]);
  };
