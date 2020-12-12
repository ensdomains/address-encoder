// Ported from https://www.npmjs.com/package/c32check to reduce file size

import { c32CheckDecode, c32CheckEncode } from './checksum';

export function c32AddressEncoder(data: Buffer) : string {
  const hash160hex = data.toString('hex');
  if (!hash160hex.match(/^[0-9a-fA-F]{40}$/)) {
    throw new Error('Invalid argument: not a hash160 hex string');
  }

  const c32string = c32CheckEncode(22, hash160hex);
  return `S${c32string}`;
}

export function c32AddressDecoder(data: string) : Buffer {
  if (data.length <= 5) {
    throw new Error('Invalid c32 address: invalid length');
  }

  const decoded = c32CheckDecode(data.slice(1));
  const decodedVersion = decoded[0];
  const decodedHex = decoded[1];

  if(decodedVersion !== 22) {
    throw Error('Invalid version');
  }

  return Buffer.from(decodedHex.toString(), 'hex');
}
