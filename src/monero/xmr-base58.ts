// Ported from https://www.npmjs.com/package/@xmr-core/xmr-b58 to reduce file size

import bigInt from 'big-integer';

const b58: any = {};

const alphabetStr = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const alphabet: number[] = [];
for (let i = 0; i < alphabetStr.length; i++) {
  alphabet.push(alphabetStr.charCodeAt(i));
}
const encodedBlockSizes = [0, 2, 3, 5, 6, 7, 9, 10, 11];

const alphabetSize = alphabet.length;
const fullBlockSize = 8;
const fullEncodedBlockSize = 11;

function hexToBin(hex: string) {
  if (hex.length % 2 !== 0) {
    throw Error("Hex string has invalid length!");
  }
  const res = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length / 2; ++i) {
    res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return res;
}

function binToHex(bin: string | any[] | Uint8Array) {
  const out = [];
  for(let i of Object.keys(bin)) {
    out.push(("0" + bin[Number(i)].toString(16)).slice(-2));
  }
  return out.join("");
}

function strToBin(str: string) {
  const res = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    res[i] = str.charCodeAt(i);
  }
  return res;
}

function binToStr(bin: string | any[] | Uint8Array) {
  const out = [];
  for(let i of Object.keys(bin)) {
    out.push(String.fromCharCode(bin[Number(i)]));
  }
  return out.join("");
}

function uint8BeTo64(data: string | any[]) {
  if (data.length < 1 || data.length > 8) {
    throw Error("Invalid input length");
  }
  let res = bigInt.zero;
  const twopow8 = bigInt(2).pow(8);
  let i = 0;
  switch (9 - data.length) {
    case 1:
      res = res.add(data[i++]);
    case 2:
      res = res.multiply(twopow8).add(data[i++]);
    case 3:
      res = res.multiply(twopow8).add(data[i++]);
    case 4:
      res = res.multiply(twopow8).add(data[i++]);
    case 5:
      res = res.multiply(twopow8).add(data[i++]);
    case 6:
      res = res.multiply(twopow8).add(data[i++]);
    case 7:
      res = res.multiply(twopow8).add(data[i++]);
    case 8:
      res = res.multiply(twopow8).add(data[i++]);
      break;
    default:
      throw Error("Impossible condition");
  }
  return res;
}

function uint64ToBe8(num: { remainder: (arg0: any) => any; divide: (arg0: any) => any; }, size: number | Iterable<number>) {
  const res = new Uint8Array(size as number);
  if (size < 1 || size > 8) {
    throw Error("Invalid input length");
  }
  const twopow8 = bigInt(2).pow(8);
  for (let i = (size as number) - 1; i >= 0; i--) {
    res[i] = parseInt(num.remainder(twopow8).toString(), 10);
    num = num.divide(twopow8);
  }
  return res;
}

b58.encodeBlock = function (data: string | any[], buf: { [x: string]: number; }, index: number) {
  if (data.length < 1 || data.length > fullEncodedBlockSize) {
    throw Error("Invalid block length: " + data.length);
  }
  let num = uint8BeTo64(data);
  let i = encodedBlockSizes[data.length] - 1;
  // while num > 0
  while (num.compare(0) === 1) {
    const div = num.divmod(alphabetSize);
    // remainder = num % alphabetSize
    const remainder = div.remainder;
    // num = num / alphabetSize
    num = div.quotient;
    buf[index + i] = alphabet[parseInt(remainder.toString(), 10)];
    i--;
  }
  return buf;
};

b58.decodeBlock = function (data: string | any[], buf: { set: (arg0: Uint8Array, arg1: any) => void; }, index: any) {
  if (data.length < 1 || data.length > fullEncodedBlockSize) {
    throw Error("Invalid block length: " + data.length);
  }

  const resSize = encodedBlockSizes.indexOf(data.length);
  if (resSize <= 0) {
    throw Error("Invalid block size");
  }
  let resNum = bigInt(0);
  let order = bigInt(1);
  for (let i = data.length - 1; i >= 0; i--) {
    const digit = alphabet.indexOf(data[i]);
    if (digit < 0) {
      throw Error("Invalid symbol");
    }
    const product = order.multiply(digit).add(resNum);
    // if product > UINT64MAX(bigInt(2).pow(64))
    if (product.compare(bigInt(2).pow(64)) === 1) {
      throw Error("Overflow");
    }
    resNum = product;
    order = order.multiply(alphabetSize);
  }
  if (
    resSize < fullBlockSize &&
    bigInt(2).pow(8 * resSize).compare(resNum) <= 0
  ) {
    throw Error("Overflow 2");
  }
  buf.set(uint64ToBe8(resNum, resSize), index);
  return buf;
};

export function xmrAddressEncoder(data: Buffer): string {
  const bin = hexToBin(data.toString('hex'));
  if (bin.length === 0) {
    throw Error('Unrecognised address format');
  }
  const fullBlockCount = Math.floor(bin.length / fullBlockSize);
  const lastBlockSize = bin.length % fullBlockSize;
  const resSize =
    fullBlockCount * fullEncodedBlockSize +
    encodedBlockSizes[lastBlockSize];

  let res = new Uint8Array(resSize);
  let i;
  for (i = 0; i < resSize; ++i) {
    res[i] = alphabet[0];
  }
  for (i = 0; i < fullBlockCount; i++) {
    res = b58.encodeBlock(
      bin.subarray(
        i * fullBlockSize,
        i * fullBlockSize + fullBlockSize,
      ),
      res,
      i * fullEncodedBlockSize,
    );
  }
  if (lastBlockSize > 0) {
    res = b58.encodeBlock(
      bin.subarray(
        fullBlockCount * fullBlockSize,
        fullBlockCount * fullBlockSize + lastBlockSize,
      ),
      res,
      fullBlockCount * fullEncodedBlockSize,
    );
  }
  return binToStr(res);
};

export function xmrAddressDecoder(data: string): Buffer {
  const bin = strToBin(data);
  if (bin.length === 0) {
    throw Error('Unrecognised address format');
  }
  const fullBlockCount = Math.floor(bin.length / fullEncodedBlockSize);
  const lastBlockSize = bin.length % fullEncodedBlockSize;
  const lastBlockDecodedSize = encodedBlockSizes.indexOf(
    lastBlockSize,
  );
  if (lastBlockDecodedSize < 0) {
    throw Error("Invalid encoded length");
  }
  const dataSize =
    fullBlockCount * fullBlockSize + lastBlockDecodedSize;
  let dataU = new Uint8Array(dataSize);
  for (let i = 0; i < fullBlockCount; i++) {
    dataU = b58.decodeBlock(
      bin.subarray(
        i * fullEncodedBlockSize,
        i * fullEncodedBlockSize + fullEncodedBlockSize,
      ),
      dataU,
      i * fullBlockSize,
    );
  }
  if (lastBlockSize > 0) {
    dataU = b58.decodeBlock(
      bin.subarray(
        fullBlockCount * fullEncodedBlockSize,
        fullBlockCount * fullEncodedBlockSize +
        lastBlockSize,
      ),
      dataU,
      fullBlockCount * fullBlockSize,
    );
  }
  return Buffer.from(binToHex(dataU), 'hex');
};