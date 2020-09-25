/*
Refernces:
Section 5.6: https://zips.z.cash/protocol/protocol.pdf
ZIP-0173: https://zips.z.cash/zip-0173
*/

import { bs58Decode, bs58Encode } from 'crypto-addr-codec';
import {
  decode as bech32Decode,
  encode as bech32Encode,
  fromWords as bech32FromWords,
  toWords as bech32ToWords,
} from 'bech32';

const BASE58_VERSION_PREFIX: { [index: string]: Buffer } = {
  t1: Buffer.from([0x1c, 0xb8]), // P2PK
  t3: Buffer.from([0x1c, 0xbd]), // P2SH
  zc: Buffer.from([0x16, 0x9a]), // SPROUT
};

const SAPLING_PREFIX = 'zs' // SAPLING

function decoder(data: string): Buffer {
  if (data.startsWith(SAPLING_PREFIX)) {
    const { prefix, words } = bech32Decode(data);
    return Buffer.from(bech32FromWords(words));
  } else if (Object.keys(BASE58_VERSION_PREFIX).some(prefix => data.startsWith(prefix))) {
    const addr = bs58Decode(data);
    return Buffer.from(addr);
  } else {
    throw Error('Unrecognised address format');
  }
}

function encoder(data: Buffer): string {
  if (Object.values(BASE58_VERSION_PREFIX).some(prefix => prefix.equals(data.slice(0, prefix.length)))) {
    return bs58Encode(data);
  } else {
    try {
      const words = bech32ToWords(data);
      return bech32Encode(SAPLING_PREFIX, words);
    } catch {
      throw Error('Unrecognised address format');
    }
  }
}

export { encoder, decoder };
