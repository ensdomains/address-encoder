"use strict";

type BaseObject = {
  alphabet: string;
  base: number;
  leader: string;
  factor: number;
  iFactor: number;
  baseMap: Uint8Array;
};

export const createBaseObject = (alphabet: string): BaseObject => {
  if (alphabet.length >= 255) {
    throw new TypeError("Alphabet too long");
  }
  const baseMap = new Uint8Array(256);
  for (let j = 0; j < baseMap.length; j++) {
    baseMap[j] = 255;
  }
  for (let i = 0; i < alphabet.length; i++) {
    const x = alphabet.charAt(i);
    const xc = x.charCodeAt(0);
    if (baseMap[xc] !== 255) {
      throw new TypeError(x + " is ambiguous");
    }
    baseMap[xc] = i;
  }
  const base = alphabet.length;
  const leader = alphabet.charAt(0);
  const factor = Math.log(base) / Math.log(256); // log(base) / log(256), rounded up
  const iFactor = Math.log(256) / Math.log(base); // log(256) / log(base), rounded up
  return {
    alphabet,
    base,
    leader,
    factor,
    iFactor,
    baseMap,
  };
};

export const createEncoderFromBaseObject =
  ({ alphabet, base, leader, iFactor }: BaseObject) =>
  (source: ArrayLike<number> | Uint8Array) => {
    if (!source || (source instanceof Uint8Array && source.length === 0)) {
      return "";
    }

    let pbegin = 0;
    let pend = source.length;
    let zeroes = 0;
    while (pbegin !== pend && source[pbegin] === 0) {
      pbegin++;
      zeroes++;
    }

    let size = ((pend - pbegin) * iFactor + 1) >>> 0;
    let b58 = new Uint8Array(size);

    let length = 0;
    while (pbegin !== pend) {
      let carry = source[pbegin];
      let i = 0;
      for (
        let it1 = size - 1;
        (carry !== 0 || i < length) && it1 !== -1;
        it1--, i++
      ) {
        carry += (256 * b58[it1]) >>> 0;
        b58[it1] = carry % base >>> 0;
        carry = (carry / base) >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i;
      pbegin++;
    }

    let it2 = size - length;
    while (it2 !== size && b58[it2] === 0) {
      it2++;
    }

    let str = leader.repeat(zeroes);
    for (; it2 < size; ++it2) {
      str += alphabet.charAt(b58[it2]);
    }
    return str;
  };

export const createUnsafeDecoderFromBaseObject =
  ({ base, leader, factor, baseMap }: BaseObject) =>
  (source: string): Uint8Array | undefined => {
    if (typeof source !== "string") {
      throw new TypeError("Expected String");
    }
    if (source.length === 0) {
      return new Uint8Array(0);
    }

    let psz = 0;
    let zeroes = 0;
    let length = 0;
    while (source[psz] === leader) {
      zeroes++;
      psz++;
    }

    let size = ((source.length - psz) * factor + 1) >>> 0;
    let b256 = new Uint8Array(size);

    while (source[psz]) {
      let carry = baseMap[source.charCodeAt(psz)];
      if (carry === 255) {
        return;
      }

      let i = 0;
      for (
        let it3 = size - 1;
        (carry !== 0 || i < length) && it3 !== -1;
        it3--, i++
      ) {
        carry += (base * b256[it3]) >>> 0;
        b256[it3] = carry % 256 >>> 0;
        carry = (carry / 256) >>> 0;
      }
      if (carry !== 0) {
        throw new Error("Non-zero carry");
      }
      length = i;
      psz++;
    }

    let it4 = size - length;
    while (it4 !== size && b256[it4] === 0) {
      it4++;
    }

    let vch = new Uint8Array(zeroes + (size - it4));
    vch.fill(0x00, 0, zeroes);
    let j = zeroes;
    while (it4 !== size) {
      vch[j++] = b256[it4++];
    }

    return vch;
  };

export const createDecoderFromBaseObject =
  (baseObject: BaseObject) =>
  (source: string): Uint8Array => {
    const value = createUnsafeDecoderFromBaseObject(baseObject)(source);
    if (value) {
      return value;
    }
    throw new Error("Non-base" + baseObject.base + " character");
  };
