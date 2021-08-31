// Ported from https://www.npmjs.com/package/cbor-redux as the release 0.4.0 was missing on npm, which has critical changes.

/* tslint:disable:max-classes-per-file */

/** @hidden */
const POW_2_24 = 5.960464477539063e-8
/** @hidden */
const POW_2_32 = 4294967296
/** @hidden */
const POW_2_53 = 9007199254740992;
/** @hidden */
const DECODE_CHUNK_SIZE = 8192

/** @hidden */
function objectIs(x: any, y: any) {
  if (typeof Object.is === 'function') {
    return Object.is(x, y);
  }

  // SameValue algorithm
  // Steps 1-5, 7-10
  if (x === y) {
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  }

  // Step 6.a: NaN == NaN
  return x !== x && y !== y
}

/** A Function that extracts tagged values. */
type TaggedValueFunction = (value: any, tag: number) => TaggedValue;
/** A function that extracts simple values. */
type SimpleValueFunction = (value: any) => SimpleValue;

/** Convenience class for structuring a tagged value. */
export class TaggedValue {
  public value: any;
  public tag: number;

  constructor(value: any, tag: number) {
    this.value = value;
    this.tag = tag;
  }
}

/** Convenience class for structuring a simple value. */
export class SimpleValue {
  public value: any;

  constructor(value: any) {
    this.value = value
  }
}

/* tslint:disable:no-bitwise */
export function decode<T = any>(
  data: ArrayBuffer | SharedArrayBuffer,
  tagger?: TaggedValueFunction,
  simpleValue?: SimpleValueFunction,
): T {
  const dataView = new DataView(data);
  const ta = new Uint8Array(data);
  let offset = 0;

  let tagValueFunction = (value: any, tag: number) => {
    return new TaggedValue(value, tag);
  }

  let simpleValueFunction = (value: any) => {
    return new SimpleValue(value);
  }

  if (typeof tagger === 'function') {
    tagValueFunction = tagger;
  }
  if (typeof simpleValue === 'function') {
    simpleValueFunction = simpleValue;
  }

  function commitRead(length: number, value: any) {
    offset += length;
    return value;
  }

  function readArrayBuffer(length: number) {
    return commitRead(length, new Uint8Array(data, offset, length));
  }

  function readFloat16() {
    const tempArrayBuffer = new ArrayBuffer(4);
    const tempDataView = new DataView(tempArrayBuffer);
    const value = readUint16();

    const sign = value & 0x8000
    let exponent = value & 0x7c00
    const fraction = value & 0x03ff

    if (exponent === 0x7c00) {
      exponent = 0xff << 10;
    }
    else if (exponent !== 0) {
      exponent += (127 - 15) << 10;
    }
    else if (fraction !== 0) {
      return (sign ? -1 : 1) * fraction * POW_2_24;
    }

    tempDataView.setUint32(0, (sign << 16) | (exponent << 13) | (fraction << 13));
    return tempDataView.getFloat32(0);
  }

  function readFloat32(): number {
    return commitRead(4, dataView.getFloat32(offset));
  }
  function readFloat64(): number {
    return commitRead(8, dataView.getFloat64(offset));
  }
  function readUint8(): number {
    return commitRead(1, ta[offset]);
  }
  function readUint16(): number {
    return commitRead(2, dataView.getUint16(offset));
  }
  function readUint32(): number {
    return commitRead(4, dataView.getUint32(offset));
  }
  function readUint64(): number {
    return readUint32() * POW_2_32 + readUint32();
  }

  function readBreak(): boolean {
    if (ta[offset] !== 0xff) {
      return false;
    }
    offset += 1;
    return true;
  }

  function readLength(additionalInformation: number): number {
    if (additionalInformation < 24) {
      return additionalInformation;
    }
    else if (additionalInformation === 24) {
      return readUint8();
    }
    else if (additionalInformation === 25) {
      return readUint16();
    }
    else if (additionalInformation === 26) {
      return readUint32();
    }
    else if (additionalInformation === 27) {
      return readUint64();
    }
    else if (additionalInformation === 31) {
      return -1;
    }

    throw new Error('Invalid length encoding')
  }

  function readIndefiniteStringLength(majorType: number): number {
    const initialByte = readUint8();
    if (initialByte === 0xff) {
      return -1;
    }

    const length = readLength(initialByte & 0x1f);
    if (length < 0 || initialByte >> 5 !== majorType) {
      throw new Error('Invalid indefinite length element');
    }

    return length;
  }

  function appendUtf16Data(utf16data: number[], length: number) {
    for (let i = 0; i < length; ++i) {
      let value = readUint8();
      if (value & 0x80) {
        if (value < 0xe0) {
          value = ((value & 0x1f) << 6) | (readUint8() & 0x3f);
          length -= 1;
        } else if (value < 0xf0) {
          value = ((value & 0x0f) << 12) | ((readUint8() & 0x3f) << 6) | (readUint8() & 0x3f);
          length -= 2;
        } else {
          value =
            ((value & 0x0f) << 18) | ((readUint8() & 0x3f) << 12) | ((readUint8() & 0x3f) << 6) | (readUint8() & 0x3f);
          length -= 3;
        }
      }

      if (value < 0x10000) {
        utf16data.push(value);
      } else {
        value -= 0x10000;
        utf16data.push(0xd800 | (value >> 10));
        utf16data.push(0xdc00 | (value & 0x3ff));
      }
    }
  }

  function decodeItem(): any {
    const initialByte = readUint8();
    const majorType = initialByte >> 5;
    const additionalInformation = initialByte & 0x1f;
    let i;
    let length;

    if (majorType === 7) {
      switch (additionalInformation) {
        case 25:
          return readFloat16();
        case 26:
          return readFloat32();
        case 27:
          return readFloat64();
      }
    }

    length = readLength(additionalInformation);
    if (length < 0 && (majorType < 2 || 6 < majorType)) {
      throw new Error('Invalid length');
    }

    switch (majorType) {
      case 0:
        return length;
      case 1:
        return -1 - length;
      case 2:
        if (length < 0) {
          const elements = [];
          let fullArrayLength = 0;

          length = readIndefiniteStringLength(majorType);
          while (length >= 0) {
            fullArrayLength += length;
            elements.push(readArrayBuffer(length));
          }

          const fullArray = new Uint8Array(fullArrayLength);
          let fullArrayOffset = 0;

          for (i = 0; i < elements.length; ++i) {
            fullArray.set(elements[i], fullArrayOffset);
            fullArrayOffset += elements[i].length;
          }

          return fullArray;
        }

        return readArrayBuffer(length);
      case 3:
        const utf16data: number[] = [];
        if (length < 0) {
          length = readIndefiniteStringLength(majorType);
          while (length >= 0) {
            appendUtf16Data(utf16data, length);
          }
        }
        else {
          appendUtf16Data(utf16data, length);
        }

        let str = '';
        for (i = 0; i < utf16data.length; i += DECODE_CHUNK_SIZE) {
          str += String.fromCharCode.apply(null, utf16data.slice(i, i + DECODE_CHUNK_SIZE));
        }

        return str;
      case 4:
        let retArray;
        if (length < 0) {
          retArray = [];
          while (!readBreak()) {
            retArray.push(decodeItem());
          }
        }
        else {
          retArray = new Array(length);
          for (i = 0; i < length; ++i) {
            retArray[i] = decodeItem();
          }
        }

        return retArray;
      case 5:
        const retObject: any = {};
        for (i = 0; i < length || (length < 0 && !readBreak()); ++i) {
          const key = decodeItem();
          retObject[key] = decodeItem();
        }

        return retObject;
      case 6:
        return tagValueFunction(decodeItem(), length);
      case 7:
        switch (length) {
          case 20:
            return false;
          case 21:
            return true;
          case 22:
            return null;
          case 23:
            return undefined;
          default:
            return simpleValueFunction(length);
        }
    }
  }

  const ret = decodeItem();
  if (offset !== data.byteLength) {
    throw new Error('Remaining bytes');
  }

  return ret;
}

export function encode<T = any>(value: T): ArrayBuffer {
  let data = new ArrayBuffer(256);
  let dataView = new DataView(data);
  let byteView = new Uint8Array(data);
  let lastLength: number;
  let offset = 0;

  function prepareWrite(length: number): DataView {
    let newByteLength = data.byteLength;
    const requiredLength = offset + length;

    while (newByteLength < requiredLength) {
      newByteLength <<= 1;
    }

    if (newByteLength !== data.byteLength) {
      const oldDataView = dataView;
      data = new ArrayBuffer(newByteLength);
      dataView = new DataView(data);
      byteView = new Uint8Array(data);
      const uint32count = (offset + 3) >> 2;

      for (let i = 0; i < uint32count; ++i) {
        dataView.setUint32(i << 2, oldDataView.getUint32(i << 2));
      }
    }

    lastLength = length;
    return dataView;
  }

  function commitWrite(...args: any[]) {
    offset += lastLength;
  }

  function writeFloat64(val: number) {
    commitWrite(prepareWrite(8).setFloat64(offset, val));
  }

  function writeUint8(val: number) {
    commitWrite(prepareWrite(1).setUint8(offset, val));
  }

  function writeUint8Array(val: number[] | Uint8Array) {
    prepareWrite(val.length);
    byteView.set(val, offset);
    commitWrite();
  }

  function writeUint16(val: number) {
    commitWrite(prepareWrite(2).setUint16(offset, val));
  }

  function writeUint32(val: number) {
    commitWrite(prepareWrite(4).setUint32(offset, val));
  }

  function writeUint64(val: number) {
    const low = val % POW_2_32;
    const high = (val - low) / POW_2_32;
    const view = prepareWrite(8);
    view.setUint32(offset, high);
    view.setUint32(offset + 4, low);
    commitWrite();
  }

  function writeVarUint(val: number, mod: number) {
    if (val <= 0xff) {
      if (val < 24) {
        writeUint8(val | mod);
      } else {
        writeUint8(0x18 | mod);
        writeUint8(val);
      }
    } else if (val <= 0xffff) {
      writeUint8(0x19 | mod);
      writeUint16(val);
    } else if (val <= 0xffffffff) {
      writeUint8(0x1a | mod);
      writeUint32(val);
    } else {
      writeUint8(0x1b | mod);
      writeUint64(val);
    }
  }

  function writeTypeAndLength(type: number, length: number) {
    if (length < 24) {
      writeUint8((type << 5) | length);
    } else if (length < 0x100) {
      writeUint8((type << 5) | 24);
      writeUint8(length);
    } else if (length < 0x10000) {
      writeUint8((type << 5) | 25);
      writeUint16(length);
    } else if (length < 0x100000000) {
      writeUint8((type << 5) | 26);
      writeUint32(length);
    } else {
      writeUint8((type << 5) | 27);
      writeUint64(length);
    }
  }

  function encodeItem(val: any) {
    let i;

    if (val === false) {
      return writeUint8(0xf4);
    } else if (val === true) {
      return writeUint8(0xf5);
    } else if (val === null) {
      return writeUint8(0xf6);
    } else if (val === undefined) {
      return writeUint8(0xf7);
    } else if (objectIs(val, -0)) {
      return writeUint8Array([0xf9, 0x80, 0x00]);
    }

    switch (typeof val) {
      case 'number':
        if (Math.floor(val) === val) {
          if (0 <= val && val <= POW_2_53) {
            return writeTypeAndLength(0, val);
          } else if (-POW_2_53 <= val && val < 0) {
            return writeTypeAndLength(1, -(val + 1));
          }
        }

        writeUint8(0xfb);
        return writeFloat64(val);

      case 'string':
        const utf8data = [];

        for (i = 0; i < val.length; i++) {
          let charCode = val.charCodeAt(i);
          if (charCode < 0x80) {
            utf8data.push(charCode);
          } else if (charCode < 0x800) {
            utf8data.push(0xc0 | (charCode >> 6));
            utf8data.push(0x80 | (charCode & 0x3f));
          } else {
            charCode = (charCode & 0x3ff) << 10;
            charCode |= val.charCodeAt(++i) & 0x3ff;
            charCode += 0x10000;

            utf8data.push(0xf0 | (charCode >> 18));
            utf8data.push(0x80 | ((charCode >> 12) & 0x3f));
            utf8data.push(0x80 | ((charCode >> 6) & 0x3f));
            utf8data.push(0x80 | (charCode & 0x3f));
          }
        }

        writeTypeAndLength(3, utf8data.length);
        return writeUint8Array(utf8data);

      default:
        let length;
        let converted;

        if (Array.isArray(val)) {
          length = val.length;

          writeTypeAndLength(4, length);
          for (i = 0; i < length; i++) {
            encodeItem(val[i]);
          }
        }
        else if (val instanceof Uint8Array) {
          writeTypeAndLength(2, val.length);
          writeUint8Array(val);
        }
        else if (ArrayBuffer.isView(val)) {
          converted = new Uint8Array(val.buffer);

          writeTypeAndLength(2, converted.length);
          writeUint8Array(converted);
        }
        else if (val instanceof ArrayBuffer || (typeof SharedArrayBuffer === 'function' && val instanceof SharedArrayBuffer)) {
          converted = new Uint8Array(val);

          writeTypeAndLength(2, converted.length);
          writeUint8Array(converted);
        }
        else if (val instanceof TaggedValue) {
          writeVarUint(val.tag, 0b11000000)
          encodeItem(val.value)
        }
        else {
          const keys = Object.keys(val);
          length = keys.length;

          writeTypeAndLength(5, length);

          for (i = 0; i < length; i++) {
            const key = keys[i];

            encodeItem(key);
            encodeItem(val[key]);
          }
        }
    }
  }

  encodeItem(value);

  if ('slice' in data) {
    return data.slice(0, offset);
  }

  const ret = new ArrayBuffer(offset);
  const retView = new DataView(ret);
  for (let i = 0; i < offset; ++i) {
    retView.setUint8(i, dataView.getUint8(i));
  }

  return ret;
}
/* tslint:enable:no-bitwise */
