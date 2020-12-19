// From https://github.com/nimiq/hub/blob/695131352e5ba58032da744c6f3938cea2894c53/src/lib/AddressUtils.ts
// https://nimiq-network.github.io/developer-reference/chapters/primitives.html#address

/* tslint:disable:no-bitwise */

const CCODE = 'NQ';
const BASE32_ALPHABET_NIMIQ = '0123456789ABCDEFGHJKLMNPQRSTUVXY';

function nimqCheck(str: string, ccode: string): string {
  function _ibanCheck(data: string): number {
    const num = data
      .split('')
      .map(c => {
        const code = c.toUpperCase().charCodeAt(0);
        return code >= 48 && code <= 57 ? c : (code - 55).toString();
      })
      .join('');
    let tmp = '';

    for (let i = 0; i < Math.ceil(num.length / 6); i++) {
      tmp = (parseInt(tmp + num.substr(i * 6, 6), 10) % 97).toString();
    }

    return parseInt(tmp, 10);
  }

  return ('00' + (98 - _ibanCheck(str + ccode + '00'))).slice(-2);
}

function toBase32(buf: Buffer, alphabet = BASE32_ALPHABET_NIMIQ): string {
  let shift = 3;
  let carry = 0;
  let byte;
  let symbol;
  let i;
  let res = '';

  for (i = 0; i < buf.length; i++) {
    byte = buf[i];
    symbol = carry | (byte >> shift);
    res += alphabet[symbol & 0x1f];

    if (shift > 5) {
      shift -= 5;
      symbol = byte >> shift;
      res += alphabet[symbol & 0x1f];
    }

    shift = 5 - shift;
    carry = byte << shift;
    shift = 8 - shift;
  }

  if (shift !== 3) {
    res += alphabet[carry & 0x1f];
  }

  while (res.length % 8 !== 0 && alphabet.length === 33) {
    res += alphabet[32];
  }

  return res;
}

function fromBase32(base32: string, alphabet = BASE32_ALPHABET_NIMIQ): Buffer {
  const charmap: { [key: string]: number } = {};
  alphabet
    .toUpperCase()
    .split('')
    .forEach((c, i) => {
      if (!(c in charmap)) {
        charmap[c] = i;
      }
    });

  let symbol;
  let shift = 8;
  let carry = 0;
  const buf = [];

  base32
    .toUpperCase()
    .split('')
    .forEach(char => {
      // ignore padding
      if (alphabet.length === 33 && char === alphabet[32]) {
        return;
      }

      symbol = charmap[char] & 0xff;

      shift -= 5;
      if (shift > 0) {
        carry |= symbol << shift;
      } else if (shift < 0) {
        buf.push(carry | (symbol >> -shift));
        shift += 8;
        carry = (symbol << shift) & 0xff;
      } else {
        buf.push(carry | symbol);
        shift = 8;
        carry = 0;
      }
    });

  if (shift !== 8 && carry !== 0) {
    buf.push(carry);
  }

  return Buffer.from(buf);
}

export function nimqDecoder(data: string): Buffer {
  if (!data.startsWith(CCODE)) {
    throw Error('Unrecognised address format');
  }
  const addr = data.replace(/ /g, '');
  const check = addr.slice(2, 4);
  const base32Part = addr.slice(4);

  if (check !== nimqCheck(base32Part, CCODE)) {
    throw Error('Unrecognised address format');
  }

  return fromBase32(base32Part);
}

export function nimqEncoder(data: Buffer): string {
  const base32Part = toBase32(data);
  const check = nimqCheck(base32Part, CCODE);
  return (CCODE + check + base32Part).replace(/.{4}/g, '$& ').trim();
}
