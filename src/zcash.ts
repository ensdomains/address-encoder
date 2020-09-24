import { bs58Decode, bs58Encode } from 'crypto-addr-codec';

const P2PK_VERSION = [0x1c, 0xb8];

function decoder(data: string): Buffer {
  if (data.startsWith('t1')) {
    const addr = bs58Decode(data);
    return Buffer.concat([Buffer.from(P2PK_VERSION), addr.slice(2)]);
  }
  throw Error('Unrecognised address format');
}

function encoder(data: Buffer): string {
  const version = data.slice(0, 2);
  if (Buffer.from(P2PK_VERSION).equals(version)) {
    return bs58Encode(data);
  } else {
    throw Error('Unrecognised address format');
  }
}

export { encoder, decoder };
