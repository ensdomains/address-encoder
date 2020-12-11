import sha256 from "fast-sha256";
import { c32, c32Decode, c32Encode, c32Normalize } from './encoding';

function c32Checksum(dataHex: string) : string {
  const dataHash = sha256(sha256(Buffer.from(dataHex, 'hex')));
  const checksum = Buffer.from(dataHash).slice(0, 4).toString('hex');
  return checksum;
}

export function c32CheckEncode(version: number, data: string) : string {
  if (version < 0 || version >= 32) {
    throw new Error('Invalid version (must be between 0 and 31)');
  }
  if (!data.match(/^[0-9a-fA-F]*$/)) {
    throw new Error('Invalid data (not a hex string)');
  }

  data = data.toLowerCase()
  if (data.length % 2 !== 0) {
    data = `0${data}`;
  }

  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }

  const checksumHex = c32Checksum(`${versionHex}${data}`);
  const c32str = c32Encode(`${data}${checksumHex}`);
  return `${c32[version]}${c32str}`;
}

export function c32CheckDecode(c32data: string) : [number, string] {
  c32data = c32Normalize(c32data);
  const dataHex = c32Decode(c32data.slice(1));
  const versionChar = c32data[0];
  const version = c32.indexOf(versionChar);
  const checksum = dataHex.slice(-8);

  let versionHex = version.toString(16);
  if (versionHex.length === 1) {
    versionHex = `0${versionHex}`;
  }

  if (c32Checksum(`${versionHex}${dataHex.substring(0, dataHex.length - 8)}`) !== checksum) {
    throw new Error('Invalid c32check string: checksum mismatch');
  }

  return [version, dataHex.substring(0, dataHex.length - 8)];
}
