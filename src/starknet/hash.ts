/* eslint-disable import/extensions */
import { keccak256 } from 'ethereum-cryptography/keccak.js';
import { hexToBytes } from 'ethereum-cryptography/utils.js';

import { addHexPrefix, buf2hex, removeHexPrefix } from './encode';
import {
  BigNumberish,
  toBN,
  toHex,
} from './number';

export const transactionVersion = 1;
export const feeTransactionVersion = toBN(2).pow(toBN(128)).add(toBN(transactionVersion));

export function keccakBn(value: BigNumberish): string {
  const hexWithoutPrefix = removeHexPrefix(toHex(toBN(value)));
  const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
  return addHexPrefix(buf2hex(keccak256(hexToBytes(evenHex))));
}
