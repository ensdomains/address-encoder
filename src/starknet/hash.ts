/* eslint-disable import/extensions */
import { Keccak } from 'sha3';

import { addHexPrefix, buf2hex, removeHexPrefix } from './encode';
import {
  BigNumberish,
  toBN,
  toHex,
} from './number';

export const transactionVersion = 1;
export const feeTransactionVersion = toBN(2).pow(toBN(128)).add(toBN(transactionVersion));

// From https://github.com/paulmillr/noble-ed25519/blob/main/index.ts#L673
function hexToBytes(hex: string): Uint8Array {
  if (typeof hex !== 'string') {
    throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
  }
  if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex');
  const array = new Uint8Array(hex.length / 2);
  for (let i = 0; i < array.length; i++) {
    const j = i * 2;
    const hexByte = hex.slice(j, j + 2);
    const byte = Number.parseInt(hexByte, 16);
    if (Number.isNaN(byte) || byte < 0) throw new Error('Invalid byte sequence');
    array[i] = byte;
  }
  return array;
}

// Originally from https://github.com/0xs34n/starknet.js/blob/83f6f9763d565110f19695805f067b4f1142b98d/src/utils/hash.ts#L32
// but replaced to use existing Keccak lib instead of loading ethereum-cryptography
export function keccakBn(value: BigNumberish): string {
  const hexWithoutPrefix = removeHexPrefix(toHex(toBN(value)));
  const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
  return addHexPrefix((new Keccak(256).update(Buffer.from(hexToBytes(evenHex))).digest()).toString('hex'))
}