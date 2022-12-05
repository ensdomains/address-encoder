import { addHexPrefix, removeHexPrefix } from './encode';
// Could not make import work for bn.js as @types/bn.js wasn't working
/* tslint:disable:no-var-requires */
const BN = require('bn.js')

export function isHex(hex: string): boolean {
  return /^0x[0-9a-f]*$/i.test(hex);
}

export type BigNumberish = string | number | typeof BN;

function assert(val:any, msg:any) {
  if (!val){
    throw new Error(msg || 'Assertion failed');
  }
}

export function toBN(num: BigNumberish, base?: number | 'hex') {
  if (typeof num === 'string') {
    // eslint-disable-next-line no-param-reassign
    num = num.toLowerCase();
  }
  if (typeof num === 'string' && isHex(num) && !base){
    return new BN(removeHexPrefix(num), 'hex');
  }
  return new BN(num, base);
}

export function toHex(num: typeof BN): string {
  return addHexPrefix(num.toString('hex'));
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