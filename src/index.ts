import { decode as bech32Decode, encode as bech32Encode, fromWords as bech32FromWords, toWords as bech32ToWords } from 'bech32';
// @ts-ignore
import { b32decode, b32encode, bs58Decode, bs58Encode, cashaddrDecode, cashaddrEncode, codec as xrpCodec, decodeCheck as decodeEd25519PublicKey, encodeCheck as encodeEd25519PublicKey, eosPublicKey, hex2a, isValid as isValidXemAddress, isValidChecksumAddress as rskIsValidChecksumAddress, ss58Decode, ss58Encode, stripHexPrefix as rskStripHexPrefix, toChecksumAddress as rskToChecksumAddress, ua2hex } from 'crypto-addr-codec';

import { cnBase58 as b58 } from '@xmr-core/xmr-b58';

type EnCoder = (data: Buffer) => string
type DeCoder = (data: string) => Buffer

interface IFormat {
  coinType: number;
  name: string;
  encoder: (data: Buffer) => string;
  decoder: (data: string) => Buffer;
}

function makeBase58CheckEncoder(p2pkhVersion: number, p2shVersion: number): (data: Buffer) => string {
  return (data: Buffer) => {
    let addr: Buffer;
    switch (data.readUInt8(0)) {
      case 0x76: // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
        if (
          data.readUInt8(1) !== 0xa9 ||
          data.readUInt8(data.length - 2) !== 0x88 ||
          data.readUInt8(data.length - 1) !== 0xac
        ) {
          throw Error('Unrecognised address format');
        }
        addr = Buffer.concat([Buffer.from([p2pkhVersion]), data.slice(3, 3 + data.readUInt8(2))]);
        // @ts-ignore
        return bs58Encode(addr);
      case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (data.readUInt8(data.length - 1) !== 0x87) {
          throw Error('Unrecognised address format');
        }
        addr = Buffer.concat([Buffer.from([p2shVersion]), data.slice(2, 2 + data.readUInt8(1))]);
        return bs58Encode(addr);
      default:
        throw Error('Unrecognised address format');
    }
  };
}

function makeBase58CheckDecoder(p2pkhVersions: number[], p2shVersions: number[]): (data: string) => Buffer {
  return (data: string) => {
    const addr = bs58Decode(data);
    const version = addr.readUInt8(0);
    if (p2pkhVersions.includes(version)) {
      return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), addr.slice(1), Buffer.from([0x88, 0xac])]);
    } else if (p2shVersions.includes(version)) {
      return Buffer.concat([Buffer.from([0xa9, 0x14]), addr.slice(1), Buffer.from([0x87])]);
    }
    throw Error('Unrecognised address format');
  };
}

const base58Chain = (name: string, coinType: number, p2pkhVersions: number[], p2shVersions: number[]) => ({
  coinType,
  decoder: makeBase58CheckDecoder(p2pkhVersions, p2shVersions),
  encoder: makeBase58CheckEncoder(p2pkhVersions[0], p2shVersions[0]),
  name,
});

function makeBech32SegwitEncoder(hrp: string): (data: Buffer) => string {
  return (data: Buffer) => {
    let version = data.readUInt8(0);
    if (version >= 0x51 && version <= 0x60) {
      version -= 0x50;
    } else if (version !== 0x00) {
      throw Error('Unrecognised address format');
    }

    const words = [version].concat(bech32ToWords(data.slice(2, data.readUInt8(1) + 2)));
    return bech32Encode(hrp, words);
  };
}

function makeBech32SegwitDecoder(hrp: string): (data: string) => Buffer {
  return (data: string) => {
    const { prefix, words } = bech32Decode(data);
    if (prefix !== hrp) {
      throw Error('Unexpected human-readable part in bech32 encoded address');
    }
    const script = bech32FromWords(words.slice(1));
    let version = words[0];
    if (version > 0) {
      version += 0x50;
    }
    return Buffer.concat([Buffer.from([version, script.length]), Buffer.from(script)]);
  };
}

function makeBitcoinEncoder(hrp: string, p2pkhVersion: number, p2shVersion: number): (data: Buffer) => string {
  const encodeBech32 = makeBech32SegwitEncoder(hrp);
  const encodeBase58Check = makeBase58CheckEncoder(p2pkhVersion, p2shVersion);
  return (data: Buffer) => {
    try {
      return encodeBase58Check(data);
    } catch {
      return encodeBech32(data);
    }
  };
}

function makeBitcoinDecoder(hrp: string, p2pkhVersions: number[], p2shVersions: number[]): (data: string) => Buffer {
  const decodeBech32 = makeBech32SegwitDecoder(hrp);
  const decodeBase58Check = makeBase58CheckDecoder(p2pkhVersions, p2shVersions);
  return (data: string) => {
    if (data.toLowerCase().startsWith(hrp + '1')) {
      return decodeBech32(data);
    } else {
      return decodeBase58Check(data);
    }
  };
}

const bitcoinChain = (
  name: string,
  coinType: number,
  hrp: string,
  p2pkhVersions: number[],
  p2shVersions: number[],
) => ({
  coinType,
  decoder: makeBitcoinDecoder(hrp, p2pkhVersions, p2shVersions),
  encoder: makeBitcoinEncoder(hrp, p2pkhVersions[0], p2shVersions[0]),
  name,
});

function encodeCashAddr(data: Buffer): string {
  switch (data.readUInt8(0)) {
    case 0x76: // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
      if (
        data.readUInt8(1) !== 0xa9 ||
        data.readUInt8(data.length - 2) !== 0x88 ||
        data.readUInt8(data.length - 1) !== 0xac
      ) {
        throw Error('Unrecognised address format');
      }
      return cashaddrEncode('bitcoincash', 0, data.slice(3, 3 + data.readUInt8(2)));
    case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
      if (data.readUInt8(data.length - 1) !== 0x87) {
        throw Error('Unrecognised address format');
      }
      return cashaddrEncode('bitcoincash', 1, data.slice(2, 2 + data.readUInt8(1)));
    default:
      throw Error('Unrecognised address format');
  }
}

function decodeCashAddr(data: string): Buffer {
  const { prefix, type, hash } = cashaddrDecode(data);
  if (type === 0) {
    return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), Buffer.from(hash), Buffer.from([0x88, 0xac])]);
  } else if (type === 1) {
    return Buffer.concat([Buffer.from([0xa9, 0x14]), Buffer.from(hash), Buffer.from([0x87])]);
  }
  throw Error('Unrecognised address format');
}

function decodeBitcoinCash(data: string): Buffer {
  const decodeBase58Check = makeBase58CheckDecoder([0x00], [0x05]);
  try {
    return decodeBase58Check(data);
  } catch {
    return decodeCashAddr(data);
  }
}

function makeChecksummedHexEncoder(chainId?: number) {
  return (data: Buffer) => rskToChecksumAddress(data.toString('hex'), chainId || null);
}

function makeChecksummedHexDecoder(chainId?: number) {
  return (data: string) => {
    const stripped = rskStripHexPrefix(data);
    if (
      !rskIsValidChecksumAddress(data, chainId || null) &&
      stripped !== stripped.toLowerCase() &&
      stripped !== stripped.toUpperCase()
    ) {
      throw Error('Invalid address checksum');
    }
    return Buffer.from(rskStripHexPrefix(data), 'hex');
  };
}

const hexChecksumChain = (name: string, coinType: number, chainId?: number) => ({
  coinType,
  decoder: makeChecksummedHexDecoder(chainId),
  encoder: makeChecksummedHexEncoder(chainId),
  name,
});

function makeBech32Encoder(prefix: string) {
  return (data: Buffer) => bech32Encode(prefix, bech32ToWords(data));
}

function makeBech32Decoder(currentPrefix: string) {
  return (data: string) => {
    const { prefix, words } = bech32Decode(data);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32FromWords(words));
  }
}

const bech32Chain = (name: string, coinType: number, prefix: string) => ({
  coinType,
  decoder: makeBech32Decoder(prefix),
  encoder: makeBech32Encoder(prefix),
  name,
});

/**
 * Decodes XMR address in base58 encoding used on XMR platform, different from Bitcoin's.
 * @param   {string}    strAddress    String of XMR address encoded in XMR version of base58.
 * @returns {Buffer}                  Buffer byte data after decoding.
 */
const decodeBase58xmr = (strAddress: string) => {
  // using xmr library for this that takes base58xmr and returns hex
  // first we get the hex of data
  const hexData = b58.decode(strAddress);
  // then convert hex to binary data in buffer we can embed into tx
  const bufferData = Buffer.from(hexData, 'hex');
  return bufferData;
};

/**
 * Encodes binary Buffer data into XMR address in base58 xmr style encoding.
 * @param   {Buffer}    bufferAddress     Buffer byte data of address.
 * @returns {string}                      String of XMR address encoded in XMR version of base58.
 */
const encodeBase58xmr = (bufferAddress: Buffer) => {
  // using xmr library for this that takes hex and returns base58xmr
  // so first we convert binary buffer into hex
  const hexData = bufferAddress.toString('hex');
  // convert hex to binary data in buffer we can embed into tx
  const base58Data = b58.encode(hexData);
  return base58Data;
};


function b32encodeXemAddr(data: Buffer): string {
  return b32encode(hex2a(data.toString('hex')));
}

function b32decodeXemAddr(data: string): Buffer {
  if (!isValidXemAddress(data)) {
    throw Error('Unrecognised address format');
  }
  const address = data.toString().toUpperCase().replace(/-/g, '');
  return b32decode(address)
}

function eosAddrEncoder(data: Buffer): string {
  if (!eosPublicKey.isValid(data)) {
    throw Error('Unrecognised address format');
  }
  return eosPublicKey.fromHex(data).toString();
}

function eosAddrDecoder(data: string): Buffer {
  if (!eosPublicKey.isValid(data)) {
    throw Error('Unrecognised address format');
  }
  return eosPublicKey(data).toBuffer();
}

function ksmAddrEncoder(data: Buffer): string {
  return ss58Encode(Uint8Array.from(data), 2)
}

function dotAddrEncoder(data: Buffer): string {
  return ss58Encode(Uint8Array.from(data), 0)
}

function ksmAddrDecoder(data: string): Buffer {
  return new Buffer(ss58Decode(data))
}



function xmrAddrEncoder(data: Buffer): string {
  return encodeBase58xmr(data);
}


function xmrAddrDecoder(data: string): Buffer {
  return new Buffer(decodeBase58xmr(data));
}



function strDecoder(data: string): Buffer {
  return decodeEd25519PublicKey('ed25519PublicKey', data)
}

function strEncoder(data: Buffer): string {
  return encodeEd25519PublicKey('ed25519PublicKey', data)
}

const getConfig = (name: string, coinType: number, encoder: EnCoder, decoder: DeCoder) => {
  return {
    coinType,
    decoder,
    encoder,
    name,
  }
}

const formats: IFormat[] = [
  bitcoinChain('BTC', 0, 'bc', [0x00], [0x05]),
  bitcoinChain('LTC', 2, 'ltc', [0x30], [0x32, 0x05]),
  base58Chain('DOGE', 3, [0x1e], [0x16]),
  base58Chain('DASH', 5, [0x4c], [0x10]),
  bitcoinChain('MONA', 22, 'mona', [0x32], [0x37, 0x05]),
  getConfig('XEM', 43, b32encodeXemAddr, b32decodeXemAddr),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
  bech32Chain('ATOM', 118, 'cosmos'),
  hexChecksumChain('RSK', 137, 30),
  getConfig('XRP', 144, (data) => xrpCodec.encodeChecked(data), (data) => xrpCodec.decodeChecked(data)),
  getConfig('BCH', 145, encodeCashAddr, decodeBitcoinCash),
  getConfig('XLM', 148, strEncoder, strDecoder),
  getConfig('XMR', 128, xmrAddrEncoder, xmrAddrDecoder),
  getConfig('EOS', 194, eosAddrEncoder, eosAddrDecoder),
  getConfig('TRX', 195, bs58Encode, bs58Decode),
  getConfig('DOT', 354, dotAddrEncoder, ksmAddrDecoder),
  getConfig('KSM', 434, ksmAddrEncoder, ksmAddrDecoder),
  hexChecksumChain('XDAI', 700),
  bech32Chain('BNB', 714, 'bnb'),
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);