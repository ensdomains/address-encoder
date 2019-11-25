import * as bech32 from 'bech32';
import * as bs58check from 'bs58check';
import * as cashaddr from 'cashaddrjs';
import * as nemSdk from 'nem-sdk'
import * as ontSdk from 'ontology-ts-sdk';
import * as ripple from 'ripple-address-codec';
import * as rsk from 'rskjs-util';
import * as stellar from 'stellar-base';
import * as tronweb from 'tronweb';

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
        return bs58check.encode(addr);
      case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (data.readUInt8(data.length - 1) !== 0x87) {
          throw Error('Unrecognised address format');
        }
        addr = Buffer.concat([Buffer.from([p2shVersion]), data.slice(2, 2 + data.readUInt8(1))]);
        return bs58check.encode(addr);
      default:
        throw Error('Unrecognised address format');
    }
  };
}

function makeBase58CheckDecoder(p2pkhVersions: number[], p2shVersions: number[]): (data: string) => Buffer {
  return (data: string) => {
    const addr = bs58check.decode(data);
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

    const words = [version].concat(bech32.toWords(data.slice(2, data.readUInt8(1) + 2)));
    return bech32.encode(hrp, words);
  };
}

function makeBech32SegwitDecoder(hrp: string): (data: string) => Buffer {
  return (data: string) => {
    const { prefix, words } = bech32.decode(data);
    if (prefix !== hrp) {
      throw Error('Unexpected human-readable part in bech32 encoded address');
    }
    const script = bech32.fromWords(words.slice(1));
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
      return cashaddr.encode('bitcoincash', 'P2PKH', data.slice(3, 3 + data.readUInt8(2)));
    case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
      if (data.readUInt8(data.length - 1) !== 0x87) {
        throw Error('Unrecognised address format');
      }
      return cashaddr.encode('bitcoincash', 'P2SH', data.slice(2, 2 + data.readUInt8(1)));
    default:
      throw Error('Unrecognised address format');
  }
}

function decodeCashAddr(data: string): Buffer {
  const { prefix, type, hash } = cashaddr.decode(data);
  if (type === 'P2PKH') {
    return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), Buffer.from(hash), Buffer.from([0x88, 0xac])]);
  } else if (type === 'P2SH') {
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
  return (data: Buffer) => rsk.toChecksumAddress(data.toString('hex'), chainId || null);
}

function makeChecksummedHexDecoder(chainId?: number) {
  return (data: string) => {
    const stripped = rsk.stripHexPrefix(data);
    if (
      !rsk.isValidChecksumAddress(data, chainId || null) &&
      stripped !== stripped.toLowerCase() &&
      stripped !== stripped.toUpperCase()
    ) {
      throw Error('Invalid address checksum');
    }
    return Buffer.from(rsk.stripHexPrefix(data), 'hex');
  };
}

const hexChecksumChain = (name: string, coinType: number, chainId?: number) => ({
  coinType,
  decoder: makeChecksummedHexDecoder(chainId),
  encoder: makeChecksummedHexEncoder(chainId),
  name,
});

function makeBech32Encoder(prefix: string) {
  return (data: Buffer) => bech32.encode(prefix, bech32.toWords(data));
}

function makeBech32Decoder(currentPrefix: string) {
  return (data: string) => {
    const { prefix, words } = bech32.decode(data);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32.fromWords(words));
  }
}

const bech32Chain = (name: string, coinType: number, prefix: string) => ({
  coinType,
  decoder: makeBech32Decoder(prefix),
  encoder: makeBech32Encoder(prefix),
  name,
});

function b32encodeXemAddr(data: Buffer): string {
  return nemSdk.default.model.address.b32encode(nemSdk.default.utils.convert.hex2a(data));
}

function b32decodeXemAddr(data: string): Buffer {
  if(!nemSdk.default.model.address.isValid(data)) {
    throw Error('Unrecognised address format');
  }
  const address = data.toString().toUpperCase().replace(/-/g, '');
  return nemSdk.default.utils.convert.ua2hex(nemSdk.default.model.address.b32decode(address));
}

function ontHexToBase58(data: Buffer): string {
  const hexAddress = new ontSdk.Crypto.Address(data.toString('hex'));
  return hexAddress.toBase58();
}

function ontBase58ToHex(data: string): Buffer {
  const strAddress = new ontSdk.Crypto.Address(data);
  return new Buffer(strAddress.serialize(),'hex');
}

const formats: IFormat[] = [
  bitcoinChain('BTC', 0, 'bc', [0x00], [0x05]),
  bitcoinChain('LTC', 2, 'ltc', [0x30], [0x32, 0x05]),
  base58Chain('DOGE', 3, [0x1e], [0x16]),
  base58Chain('DASH', 5, [0x4c], [0x10]),
  bitcoinChain('MONA', 22, 'mona', [0x32], [0x37, 0x05]),
  {
    coinType: 43,
    decoder: b32decodeXemAddr,
    encoder: b32encodeXemAddr,
    name: 'XEM',
  },
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
  bech32Chain('ATOM', 118, 'cosmos'),
  hexChecksumChain('RSK', 137, 30),
  {
    coinType: 144,
    decoder: (data: string) => ripple.codec.decodeChecked(data),
    encoder: (data: Buffer) => ripple.codec.encodeChecked(data),
    name: 'XRP',
  },
  {
    coinType: 145,
    decoder: decodeBitcoinCash,
    encoder: encodeCashAddr,
    name: 'BCH',
  },
  {
    coinType: 148,
    decoder: stellar.StrKey.decodeEd25519PublicKey,
    encoder: stellar.StrKey.encodeEd25519PublicKey,
    name: 'XLM',
  },
  {
    coinType: 195,
    decoder: tronweb.address.toHex,
    encoder: tronweb.address.fromHex,
    name: 'TRX',
  },  
  {
    coinType: 714,
    decoder: (data: string) => {
      const { prefix, words } = bech32.decode(data);
      if (prefix !== 'bnb') {
        throw Error('Unrecognised address format');
      }
      return Buffer.from(bech32.fromWords(words));
    },
    encoder: (data: Buffer) => {
      return bech32.encode('bnb', bech32.toWords(data));
    },
    name: 'BNB',
  },
  hexChecksumChain('XDAI', 700),
  bech32Chain('BNB', 714, 'bnb'),
  {
    coinType: 1024,
    decoder: ontBase58ToHex,
    encoder: ontHexToBase58,
    name: 'ONT',
  },
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);
