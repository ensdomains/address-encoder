import base58 from 'bs58';
import Sha256 from 'sha.js/sha256';

function sha256x2(buffer: Buffer): Buffer {
  const tmp = new Sha256().update(buffer).digest();

  return new Sha256().update(tmp).digest();
}

const bs58Check = (checksumFn: (buffer: Buffer) => Buffer) => {
  function decodeRaw(buffer: Buffer): Buffer | undefined {
    const payload = buffer.slice(0, -4);
    const checksum = buffer.slice(-4);
    const newChecksum = checksumFn(payload);
    /* tslint:disable:no-bitwise */
    if (
      (checksum[0] ^ newChecksum[0]) |
      (checksum[1] ^ newChecksum[1]) |
      (checksum[2] ^ newChecksum[2]) |
      (checksum[3] ^ newChecksum[3])
    ) {
      return;
    }

    return payload;
  }

  return {
    // Encode a buffer as a base58-check encoded string
    encode(payload: Buffer): string {
      const checksum = checksumFn(payload);

      return base58.encode(Buffer.concat([payload, checksum], payload.length + 4));
    },
    // Decode a base58-check encoded string to a buffer, no result if checksum is wrong
    decodeUnsafe(data: string): Buffer | undefined {
      const buffer = base58.decodeUnsafe(data);

      if (!buffer) {
        return;
      }

      return decodeRaw(buffer);
    },
    decode(data: string): Buffer {
      const buffer = base58.decode(data);
      const payload = decodeRaw(buffer);

      if (!payload) {
        throw new Error('Invalid checksum');
      }

      return payload;
    },
  };
};

const bs58 = bs58Check(sha256x2);

export default bs58;

export const { encode, decode, decodeUnsafe } = bs58;
