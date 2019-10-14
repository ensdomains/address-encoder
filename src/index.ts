import { Buffer } from 'safe-buffer';
import * as bs58check from 'bs58check';
import * as eip55 from 'eip55';

interface Format {
    coinType: number;
    name: string;
    encoder: (data: Buffer) => string;
    decoder: (data: string) => Buffer;
}

const base58Chain = (name: string, coinType: number) => ({
  name: name,
  coinType: coinType,
  encoder: bs58check.encode,
  decoder: bs58check.decode,
});

function encodeChecksummedHex(data: Buffer): string {
  return eip55.encode('0x' + data.toString('hex'));
}

function decodeChecksummedHex(data: string): Buffer {
  return Buffer.from(data.slice(2), 'hex');
}

const hexChecksumChain = (name: string, coinType: number) => ({
  name: name,
  coinType: coinType,
  encoder: encodeChecksummedHex,
  decoder: decodeChecksummedHex,
});

const formats: Array<Format> = [
  base58Chain('BTC', 0),
  base58Chain('LTC', 2),
  base58Chain('MONA', 22),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
  hexChecksumChain('RSK', 137),
  base58Chain('BCH', 145),
];

export const formatsByName: {[key: string]: Format} = Object.assign({}, ...formats.map((x) => ({[x.name]: x})));
export const formatsByCoinType: {[key: number]: Format} = Object.assign({}, ...formats.map((x) => ({[x.coinType]: x})));
