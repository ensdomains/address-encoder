import BN from 'bn.js';

import { addHexPrefix, removeHexPrefix } from './encode';

export type BigNumberish = string | number | BN;

export function isHex(hex: string): boolean {
  return /^0x[0-9a-f]*$/i.test(hex);
}

function assert(val:any, msg:any) {
  if (!val)
    throw new Error(msg || 'Assertion failed');
}

export function toBN(number: BigNumberish, base?: number | 'hex') {
  if (typeof number === 'string') {
    // eslint-disable-next-line no-param-reassign
    number = number.toLowerCase();
  }
  if (typeof number === 'string' && isHex(number) && !base)
    return new BN(removeHexPrefix(number), 'hex');
  return new BN(number, base);
}

export function toHex(number: BN): string {
  return addHexPrefix(number.toString('hex'));
}

/*
 Asserts input is equal to or greater then lowerBound and lower then upperBound.
 Assert message specifies inputName.
 input, lowerBound, and upperBound should be of type BN.
 inputName should be a string.
*/
export function assertInRange(
  input: BigNumberish,
  lowerBound: BigNumberish,
  upperBound: BigNumberish,
  inputName = ''
) {
  const messageSuffix = inputName === '' ? 'invalid length' : `invalid ${inputName} length`;
  const inputBn = toBN(input);
  assert(
    inputBn.gte(toBN(lowerBound)) && inputBn.lt(toBN(upperBound)),
    `Message not signable, ${messageSuffix}.`
  );
}