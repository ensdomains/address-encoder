// from https://github.com/ethers-io/ethers.js/blob/ef1b28e958b50cea7ff44da43b3c5ff054e4b483/packages/bytes/src.ts/index.ts
type Bytes = ArrayLike<number>;
type BytesLike = Bytes | string;

interface IDataOptions {
  allowMissingPrefix?: boolean;
  hexPad?: "left" | "right" | null;
};
interface IHexable {
  toHexString(): string;
}
function isHexable(value: any): value is IHexable {
  return !!(value.toHexString);
}
function isInteger(value: number) {
  return (typeof(value) === "number" && value === value && (value % 1) === 0);
}

function isBytes(value: any): value is Bytes {
  if (value == null) { return false; }

  if (value.constructor === Uint8Array) { return true; }
  if (typeof(value) === "string") { return false; }
  if (!isInteger(value.length) || value.length < 0) { return false; }

  for (const v of value) {
    if (!isInteger(v) || v < 0 || v >= 256) { return false; }
  }
  // for (let i = 0; i < value.length; i++) {
  //     const v = value[i];
  //     if (!isInteger(v) || v < 0 || v >= 256) { return false; }
  // }
  return true;
}

function addSlice(array: Uint8Array): Uint8Array {
  if(typeof(array) === 'undefined'){ throw Error('array undefined') }
  // if (array && array.slice) { return array; }

  // array.slice = function() {
  //     const args = Array.prototype.slice.call(arguments);
  //     return addSlice(new Uint8Array(Array.prototype.slice.apply(array, args)));
  // }

  return array;
}

function checkSafeUint53(value: number, message?: string): void {
  if (typeof(value) !== "number") { return; }

  if (message == null) { message = "value not safe"; }

  if (value < 0 || value >= 0x1fffffffffffff) {
    throw(message);
  }

  if (value % 1) {
    throw(message)
  }
}
function isHexString(value: any, length?: number): boolean {
  if (typeof(value) !== "string" || !value.match(/^0x[0-9A-Fa-f]*$/)) {
    return false
  }
  if (length && value.length !== 2 + 2 * length) { return false; }
  return true;
}

export function arrayify(value: BytesLike | IHexable | number, options?: IDataOptions): Uint8Array | undefined {
  if (!options) { options = { }; }

  if (typeof(value) === "number") {
    checkSafeUint53(value, "invalid arrayify value");
    const result = [];
    while (value) {
      /* tslint:disable-next-line:no-bitwise */
      result.unshift(value & 0xff);
      value = parseInt(String(value / 256), 10);
    }
    if (result.length === 0) { result.push(0); }

    return addSlice(new Uint8Array(result));
  }

  if (options.allowMissingPrefix && typeof(value) === "string" && value.substring(0, 2) !== "0x") {
    value = "0x" + value;
  }

  if (isHexable(value)) { value = value.toHexString(); }

  if (isHexString(value)) {
    let hex = (value as string).substring(2);
    if (hex.length % 2) {
      if (options.hexPad === "left") {
        hex = "0" + hex;
      } else if (options.hexPad === "right") {
        hex += "0";
      } else {
        throw Error("hex data is odd-length" + "value" + value);
      }
    }

    const result = [];
    for (let i = 0; i < hex.length; i += 2) {
      result.push(parseInt(hex.substring(i, i + 2), 16));
    }

    return addSlice(new Uint8Array(result));
  }

  if (isBytes(value)) {
    return addSlice(new Uint8Array(value));
  }
}
