/* eslint-disable import/extensions */
import { keccak_256 } from '@noble/hashes/sha3';
import { bytesToHex, hexToBytes } from '@noble/hashes/utils';
import { removeHexPrefix } from './encode';
import { BigNumberish, toBN, toHex } from './number';

export const transactionVersion = 1;
export const feeTransactionVersion = toBN(2)
  .pow(toBN(128))
  .add(toBN(transactionVersion));

// Originally from https://github.com/0xs34n/starknet.js/blob/83f6f9763d565110f19695805f067b4f1142b98d/src/utils/hash.ts#L32
// but replaced to use existing Keccak lib instead of loading ethereum-cryptography
export function keccakBn(value: BigNumberish): string {
  const hexWithoutPrefix = removeHexPrefix(toHex(toBN(value)));
  const evenHex = hexWithoutPrefix.length % 2 === 0 ? hexWithoutPrefix : `0${hexWithoutPrefix}`;
  return `0x${bytesToHex(keccak_256(hexToBytes(evenHex)))}`;
}
