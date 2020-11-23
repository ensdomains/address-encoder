// https://gitlab.com/mjbecze/leb128 was ported so that we can reuse older version of bn.js (4.0.0) instead of the one leb128 uses (5.1)

// Could not make import work for bn.js as @types/bn.js wasn't working
/* tslint:disable:no-var-requires */
const Bn = require('bn.js')
// https://gitlab.com/mjbecze/leb128/-/blob/master/stream.js
class Stream{
  public buffer:Buffer
  private bytesRead:number

  constructor (buf:Buffer = Buffer.from([])) {
    this.buffer = buf
    this.bytesRead = 0
  }

  public read (size:number) {
    const data = this.buffer.slice(0, size)
    this.buffer = this.buffer.slice(size)
    this.bytesRead += size
    return data
  }

  public write (buf:[any]) {
    this.buffer = Buffer.concat([this.buffer, Buffer.from(buf)])
  }
}

// https://gitlab.com/mjbecze/leb128/-/blob/master/unsigned.js
function read (stream: Stream) {
  return readBn(stream).toString()
}

function readBn (stream: Stream) {
  const num = new Bn(0)
  let shift = 0
  let byt
  while (true) {
    byt = stream.read(1)[0]
    /* tslint:disable:no-bitwise */
    num.ior(new Bn(byt & 0x7f).shln(shift))
    if (byt >> 7 === 0) {
      break
    } else {
      shift += 7
    }
  }
  return num
}

function write (num:string | number, stream: Stream) {
  const bigNum = new Bn(num)
  while (true) {
    const i = bigNum.maskn(7).toNumber()
    bigNum.ishrn(7)
    if (bigNum.isZero()) {
      stream.write([i])
      break
    } else {
      stream.write([i | 0x80])
    }
  }
}

/**
 * LEB128 encodeds an interger
 * @param {String|Number} num
 * @return {Buffer}
 */
export function encode (num: string | number ) {
  const stream = new Stream()
  write(num, stream)
  return stream.buffer
}

/**
 * decodes a LEB128 encoded interger
 * @param {Buffer} buffer
 * @return {String}
 */
export function decode (buffer:Buffer) {
  const stream = new Stream(buffer)
  return read(stream)
}
