// @ts-ignore
import { blake2b } from 'blakejs'

const nanoAlphabet = '13456789abcdefghijkmnopqrstuwxyz'

function nanobase32(buffer: Uint8Array): string {
  const length = buffer.length
  const leftover = (length * 8) % 5
  const offset = leftover === 0 ? 0 : 5 - leftover
  let value = 0
  let output = ''
  let bits = 0
  for (let i = 0; i < length; i++) {
    // tslint:disable-next-line:no-bitwise
    value = (value << 8) | buffer[i]
    bits += 8
    while (bits >= 5) {
      // tslint:disable-next-line:no-bitwise
      output += nanoAlphabet[(value >>> (bits + offset - 5)) & 31]
      bits -= 5
    }
  }
  if (bits > 0) {
    // tslint:disable-next-line:no-bitwise
    output += nanoAlphabet[(value << (5 - (bits + offset))) & 31]
  }
  return output
}

export function encodeNanoAddr(data: Buffer): string {
  const hex = data.toString('hex');
  // tslint:disable-next-line:no-bitwise
  const length = (hex.length / 2) | 0;
  const uint8 = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    uint8[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  const address = nanobase32(uint8);
  const checksumbytes = blake2b(uint8, null, 5).reverse();
  const checksum = nanobase32(checksumbytes);
  return 'nano_' + address + checksum
}

export function decodeNanoAddr(account: string): Buffer {
  if (
  ((account.startsWith('nano_1') || account.startsWith('nano_3')) && (account.length === 65))   ||
  ((account.startsWith('xrb_1') || account.startsWith('xrb_3')) && (account.length === 64))
  ) {
    const accountCrop = account.slice(-60);
    const isValid = /^[13456789abcdefghijkmnopqrstuwxyz]+$/.test(accountCrop);
    if (isValid) {
      const input = accountCrop.substring(0, 52);
      const length = input.length
      const leftover = (length * 5) % 8
      const offset = leftover === 0 ? 0 : 8 - leftover
      let bits = 0
      let value = 0
      let index = 0
      let output = new Uint8Array(Math.ceil(length * 5 / 8))
      for (let i = 0; i < length; i++) {
	// tslint:disable-next-line:no-bitwise
        value = (value << 5) | nanoAlphabet.indexOf(input[i])
        bits += 5
        if (bits >= 8) {
          // tslint:disable-next-line:no-bitwise
          output[index++] = (value >>> (bits + offset - 8)) & 255
          bits -= 8
        }
      }
      if (bits > 0) {
	// tslint:disable-next-line:no-bitwise
        output[index++] = (value << (bits + offset - 8)) & 255
      }
      if (leftover !== 0) {
        output = output.slice(1)
      }
      return Buffer.from(output);
    } else {
      throw Error('Illegal characters found');
    }
  } else {
    throw Error('Invalid account');
  }
}
