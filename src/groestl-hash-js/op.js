'use strict';
// the right shift is important, it has to do with 32 bit operations in javascript, it will make things faster
export function u64(h, l) {
  /* tslint:disable:no-bitwise */
  this.hi = h >>> 0;
  this.lo = l >>> 0;
  /* tslint:enable:no-bitwise */
}

u64.prototype.set = function(oWord) {
  this.lo = oWord.lo;
  this.hi = oWord.hi;
};

u64.prototype.add = function(oWord) {
  let lowest;
  let lowMid;
  let highMid;
  let highest; // four parts of the whole 64 bit number..

  // need to add the respective parts from each number and the carry if on is present..
  /* tslint:disable:no-bitwise */
  lowest = (this.lo & 0XFFFF) + (oWord.lo & 0XFFFF);
  lowMid = (this.lo >>> 16) + (oWord.lo >>> 16) + (lowest >>> 16);
  highMid = (this.hi & 0XFFFF) + (oWord.hi & 0XFFFF) + (lowMid >>> 16);
  highest = (this.hi >>> 16) + (oWord.hi >>> 16) + (highMid >>> 16);

  // now set the hgih and the low accordingly..
  this.lo = (lowMid << 16) | (lowest & 0XFFFF);
  this.hi = (highest << 16) | (highMid & 0XFFFF);
  /* tslint:enable:no-bitwise */

  return this; // for chaining..
};

u64.prototype.addOne = function() {
  if (this.lo === -1 || this.lo === 0xFFFFFFFF) {
    this.lo = 0;
    this.hi++;
  }
  else {
    this.lo++;
  }
};

u64.prototype.plus = function(oWord) {
  let c = new u64(0, 0);
  let lowest;
  let lowMid;
  let highMid;
  let highest; // four parts of the whole 64 bit number..

  // need to add the respective parts from each number and the carry if on is present..
  /* tslint:disable:no-bitwise */
  lowest = (this.lo & 0XFFFF) + (oWord.lo & 0XFFFF);
  lowMid = (this.lo >>> 16) + (oWord.lo >>> 16) + (lowest >>> 16);
  highMid = (this.hi & 0XFFFF) + (oWord.hi & 0XFFFF) + (lowMid >>> 16);
  highest = (this.hi >>> 16) + (oWord.hi >>> 16) + (highMid >>> 16);

  // now set the hgih and the low accordingly..
  c.lo = (lowMid << 16) | (lowest & 0XFFFF);
  c.hi = (highest << 16) | (highMid & 0XFFFF);
  /* tslint:enable:no-bitwise */

  return c; //for chaining..
};

u64.prototype.not = function() {
  /* tslint:disable:no-bitwise */
  return new u64(~this.hi, ~this.lo);
  /* tslint:enable:no-bitwise */
};

u64.prototype.one = function() {
  return new u64(0x0, 0x1);
};

u64.prototype.zero = function() {
  return new u64(0x0, 0x0);
};

u64.prototype.neg = function() {
  return this.not().plus(this.one());
};

u64.prototype.minus = function(oWord) {
  return this.plus(oWord.neg());
};

u64.prototype.isZero = function() {
  return (this.lo === 0) && (this.hi === 0);
};

function isLong(obj) {
  // @ts-nocheck
  return (obj && obj.__isLong__) === true;
}

function fromNumber(value) {
  if (isNaN(value) || !isFinite(value)) {
    return this.zero();}
  /* tslint:disable:no-bitwise */
  let pow32 = (1 << 32);
  
  return new u64((value % pow32) | 0, (value / pow32) | 0);
  /* tslint:enable:no-bitwise */
}

u64.prototype.multiply = function(multiplier) {
  if (this.isZero()) {
    return this.zero();}
  if (!isLong(multiplier)) {
    multiplier = fromNumber(multiplier); }
  if (multiplier.isZero()) {
    return this.zero();}

  // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
  // We can skip products that would overflow.

  /* tslint:disable:no-bitwise */
  let a48 = this.hi >>> 16;
  let a32 = this.hi & 0xFFFF;
  let a16 = this.lo >>> 16;
  let a00 = this.lo & 0xFFFF;

  let b48 = multiplier.hi >>> 16;
  let b32 = multiplier.hi & 0xFFFF;
  let b16 = multiplier.lo >>> 16;
  let b00 = multiplier.lo & 0xFFFF;

  let c48 = 0;
  let c32 = 0;
  let c16 = 0;
  let c00 = 0;
  c00 += a00 * b00;
  c16 += c00 >>> 16;
  c00 &= 0xFFFF;
  c16 += a16 * b00;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c16 += a00 * b16;
  c32 += c16 >>> 16;
  c16 &= 0xFFFF;
  c32 += a32 * b00;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a16 * b16;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c32 += a00 * b32;
  c48 += c32 >>> 16;
  c32 &= 0xFFFF;
  c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
  c48 &= 0xFFFF;
  return new u64((c48 << 16) | c32, (c16 << 16) | c00);
  /* tslint:enable:no-bitwise */
};

u64.prototype.shiftLeft = function(bits) {
  bits = bits % 64;
  let c = new u64(0, 0);
  /* tslint:disable:no-bitwise */
  if (bits === 0) {
    return this.clone();
  }
  else if (bits > 31) {
    c.lo = 0;
    c.hi = this.lo << (bits - 32);
  }
  else {
    let toMoveUp = this.lo >>> 32 - bits;
    c.lo = this.lo << bits;
    c.hi = (this.hi << bits) | toMoveUp;
  }
  /* tslint:enable:no-bitwise */
  return c; //for chaining..
};

u64.prototype.setShiftLeft = function(bits) {
  if (bits === 0) {
    return this;
  }
  if (bits > 63) {
    bits = bits % 64;
  }
  /* tslint:disable:no-bitwise */
  if (bits > 31) {
    this.hi = this.lo << (bits - 32);
    this.lo = 0;
  }
  else {
    let toMoveUp = this.lo >>> 32 - bits;
    this.lo <<= bits;
    this.hi = (this.hi << bits) | toMoveUp;
  }
  /* tslint:enable:no-bitwise */
  return this; // for chaining..
};
// Shifts this word by the given number of bits to the right (max 32)..
u64.prototype.shiftRight = function(bits) {
  bits = bits % 64;
  let c = new u64(0, 0);
  /* tslint:disable:no-bitwise */
  if (bits === 0) {
    return this.clone();
  }
  else if (bits >= 32) {
    c.hi = 0;
    c.lo = this.hi >>> (bits - 32);
  }
  else {
    let bitsOff32 = 32 - bits;
    let toMoveDown = this.hi << bitsOff32 >>> bitsOff32;
    c.hi = this.hi >>> bits;
    c.lo = this.lo >>> bits | (toMoveDown << bitsOff32);
  }
  /* tslint:enable:no-bitwise */
  return c; // for chaining..
};
// Rotates the bits of this word round to the left (max 32)..
u64.prototype.rotateLeft = function(bits) {
  if (bits > 32) {
    return this.rotateRight(64 - bits);
  }
  /* tslint:disable:no-bitwise */
  let c = new u64(0, 0);
  if (bits === 0) {
    c.lo = this.lo >>> 0;
    c.hi = this.hi >>> 0;
  }
  else if (bits === 32) { //just switch high and low over in this case..
    c.lo = this.hi;
    c.hi = this.lo;
  }
  else {
    c.lo = (this.lo << bits) | (this.hi >>> (32 - bits));
    c.hi = (this.hi << bits) | (this.lo >>> (32 - bits));
  }
  /* tslint:enable:no-bitwise */
  return c; // for chaining..
};

u64.prototype.setRotateLeft = function(bits) {
  if (bits > 32) {
    return this.setRotateRight(64 - bits);
  }
  /* tslint:disable:no-bitwise */
  let newHigh;
  if (bits === 0) {
    return this;
  }
  else if (bits === 32) { //just switch high and low over in this case..
    newHigh = this.lo;
    this.lo = this.hi;
    this.hi = newHigh;
  }
  else {
    newHigh = (this.hi << bits) | (this.lo >>> (32 - bits));
    this.lo = (this.lo << bits) | (this.hi >>> (32 - bits));
    this.hi = newHigh;
  }
  /* tslint:enable:no-bitwise */
  return this; // for chaining..
};
// Rotates the bits of this word round to the right (max 32)..
u64.prototype.rotateRight = function(bits) {
  if (bits > 32) {
    return this.rotateLeft(64 - bits);
  }
  /* tslint:disable:no-bitwise */
  let c = new u64(0, 0);
  if (bits === 0) {
    c.lo = this.lo >>> 0;
    c.hi = this.hi >>> 0;
  }
  else if (bits === 32) { // just switch high and low over in this case..
    c.lo = this.hi;
    c.hi = this.lo;
  }
  else {
    c.lo = (this.hi << (32 - bits)) | (this.lo >>> bits);
    c.hi = (this.lo << (32 - bits)) | (this.hi >>> bits);
  }
  /* tslint:enable:no-bitwise */
  return c; // for chaining..
};
u64.prototype.setFlip = function() {
  let newHigh;
  newHigh = this.lo;
  this.lo = this.hi;
  this.hi = newHigh;
  return this;
};
// Rotates the bits of this word round to the right (max 32)..
u64.prototype.setRotateRight = function(bits) {
  if (bits > 32) {
    return this.setRotateLeft(64 - bits);
  }

  if (bits === 0) {
    return this;
  }
  else if (bits === 32) { //just switch high and low over in this case..
    let newHigh;
    newHigh = this.lo;
    this.lo = this.hi;
    this.hi = newHigh;
  }
  else {
    /* tslint:disable:no-bitwise */
    newHigh = (this.lo << (32 - bits)) | (this.hi >>> bits);
    this.lo = (this.hi << (32 - bits)) | (this.lo >>> bits);
    /* tslint:enable:no-bitwise */
    this.hi = newHigh;
  }
  return this; // for chaining..
};
// Xors this word with the given other..
u64.prototype.xor = function(oWord) {
  let c = new u64(0, 0);
  /* tslint:disable:no-bitwise */
  c.hi = this.hi ^ oWord.hi;
  c.lo = this.lo ^ oWord.lo;
  /* tslint:enable:no-bitwise */
  return c; // for chaining..
};
// Xors this word with the given other..
u64.prototype.setxorOne = function(oWord) {
  /* tslint:disable:no-bitwise */
  this.hi ^= oWord.hi;
  this.lo ^= oWord.lo;
  /* tslint:enable:no-bitwise */
  return this; // for chaining..
};
// Ands this word with the given other..
u64.prototype.and = function(oWord) {
  let c = new u64(0, 0);
  /* tslint:disable:no-bitwise */
  c.hi = this.hi & oWord.hi;
  c.lo = this.lo & oWord.lo;
  /* tslint:enable:no-bitwise */
  return c; //for chaining..
};

// Creates a deep copy of this Word..
u64.prototype.clone = function() {
  return new u64(this.hi, this.lo);
};

u64.prototype.setxor64 = function() {
  let a = arguments;
  let i = a.length;
  /* tslint:disable:no-bitwise */
  while (i--) {
    this.hi ^= a[i].hi;
    this.lo ^= a[i].lo;
  }
  /* tslint:enable:no-bitwise */
  return this;
}

export function u(h, l) {      
  return new u64(h, l);
}

export function xor64() {
  let a = arguments;
  let h = a[0].hi;
  let l = a[0].lo;
  let i = a.length-1;
  /* tslint:disable:no-bitwise */
  do {
    h ^= a[i].hi;
    l ^= a[i].lo;
    i--;
  } while (i>0);
  /* tslint:enable:no-bitwise */
  return new this.u64(h, l);
}

export function clone64Array(array) {
  let i = 0;
  let len = array.length;
  let a = new Array(len);
  while(i<len) {
    a[i] = array[i];
    i++;
  }
  return a;
}

// this shouldn't be a problem, but who knows in the future javascript might support 64bits
export function t32(x) {
  /* tslint:disable:no-bitwise */
  return (x & 0xFFFFFFFF);
  /* tslint:enable:no-bitwise */
}

export  function rotl32(x, c) {
  /* tslint:disable:no-bitwise */
  return (((x) << (c)) | ((x) >>> (32 - (c)))) & (0xFFFFFFFF);
  /* tslint:enable:no-bitwise */
}

export  function rotr32(x, c) {
  return this.rotl32(x, (32 - (c)));
}

export  function swap32(val) {
  /* tslint:disable:no-bitwise */
  return ((val & 0xFF) << 24) |
    ((val & 0xFF00) << 8) |
    ((val >>> 8) & 0xFF00) |
    ((val >>> 24) & 0xFF);
  /* tslint:enable:no-bitwise */
}

export function swap32Array(a) {
  // can't do this with map because of support for IE8 (Don't hate me plz).
  let i = 0;
  let len = a.length;
  let r = new Array(i);
  while (i<len) {
    r[i] = (this.swap32(a[i]));
    i++;
  }
  return r;
}

export function xnd64(x, y, z) {
  /* tslint:disable:no-bitwise */
  return new this.u64(x.hi ^ ((~y.hi) & z.hi), x.lo ^ ((~y.lo) & z.lo));
  /* tslint:enable:no-bitwise */
}

export function bufferInsert(buffer, bufferOffset, data, len, dataOffset) {
  /* tslint:disable:no-bitwise */
  dataOffset = dataOffset | 0;
  /* tslint:enable:no-bitwise */
  let i = 0;
  while (i < len) {
    buffer[i + bufferOffset] = data[i + dataOffset];
    i++;
  }
}

export function bufferInsert64(buffer, bufferOffset, data, len) {
  let i = 0;
  while (i < len) {
    buffer[i + bufferOffset] = data[i].clone();
    i++;
  }
}

export function bufferInsertBackwards(buffer, bufferOffset, data, len) {
  let i = 0;
  while (i < len) {
    buffer[i + bufferOffset] = data[len - 1 - i];
    i++;
  }
}

export function bufferSet(buffer, bufferOffset, value, len) {
  let i = 0;
  while (i < len) {
    buffer[i + bufferOffset] = value;
    i++;
  }
}

export function bufferXORInsert(buffer, bufferOffset, data, dataOffset, len) {
  let i = 0;
  while (i < len) {
    /* tslint:disable:no-bitwise */
    buffer[i + bufferOffset] ^= data[i + dataOffset];
    /* tslint:enable:no-bitwise */
    i++;
  }
}

export function xORTable(d, s1, s2, len) {
  let i = 0;
  while (i < len) {
    /* tslint:disable:no-bitwise */
    d[i] = s1[i] ^ s2[i];
    /* tslint:enable:no-bitwise */
    i++
  }
}
