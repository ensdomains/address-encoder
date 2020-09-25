import { bs58Decode, bs58Encode } from 'crypto-addr-codec';
import {
  decode as bech32Decode,
  encode as bech32Encode,
  fromWords as bech32FromWords,
  toWords as bech32ToWords,
} from 'bech32';

const P2PK_VERSION = [0x1c, 0xb8];
const P2SH_VERSION = [0x1c, 0xbd];
const SPROUT_VERSION = [0x16, 0x9a];
const SAPLING_PREFIX = 'zs';

function decoder(data: string): Buffer {
  if (data.startsWith('t1')) {
    const addr = bs58Decode(data);
    return Buffer.concat([Buffer.from(P2PK_VERSION), addr.slice(2)]);
  } else if (data.startsWith('t3')) {
    const addr = bs58Decode(data);
    return Buffer.concat([Buffer.from(P2SH_VERSION), addr.slice(2)]);
  } else if (data.startsWith('zc')) {
    const addr = bs58Decode(data);
    return Buffer.concat([Buffer.from(SPROUT_VERSION), addr.slice(2)]);
  } else if (data.startsWith('zs')) {
    const { prefix, words } = bech32Decode(data);
    return Buffer.from(bech32FromWords(words));
  } else {
    throw Error('Unrecognised address format');
  }
}

function encoder(data: Buffer): string {
  const version = data.slice(0, 2);
  if (
    Buffer.from(P2PK_VERSION).equals(version) ||
    Buffer.from(P2SH_VERSION).equals(version) ||
    Buffer.from(SPROUT_VERSION).equals(version)
  ) {
    return bs58Encode(data);
  } else {
    try {
      const words = bech32ToWords(data);
      return bech32Encode(SAPLING_PREFIX, words);
    }
    catch {
      throw Error('Unrecognised address format');
    }
  }
}

export { encoder, decoder };
