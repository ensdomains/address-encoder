import { bs58Decode, bs58Encode } from 'crypto-addr-codec';

const P2PK_VERSION = [0x1c, 0xb8];
const P2SH_VERSION = [0x1c, 0xbd];
const SPROUT_VERSION = [0x16, 0x9a];

function decoder(data: string): Buffer {
  const addr = bs58Decode(data);
  if (data.startsWith('t1')) {
    return Buffer.concat([Buffer.from(P2PK_VERSION), addr.slice(2)]);
  } else if (data.startsWith('t3')) {
    return Buffer.concat([Buffer.from(P2SH_VERSION), addr.slice(2)]);
  } else if (data.startsWith('zc') || data.startsWith('zt')) {
    return Buffer.concat([Buffer.from(SPROUT_VERSION), addr.slice(2)]);
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
    throw Error('Unrecognised address format');
  }
}

export { encoder, decoder };
