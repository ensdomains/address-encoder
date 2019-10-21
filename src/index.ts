import * as bech32 from 'bech32';
import * as bs58check from 'bs58check';
import * as eip55 from 'eip55';

interface IFormat {
  coinType: number;
  name: string;
  encoder: (data: Buffer) => string;
  decoder: (data: string) => Buffer;
}

function encodeBase58Check(data: Buffer): string {
  let addr:Buffer;
  switch (data.readUInt8(0)) {
    case 0x76: // P2PKH: OP_DUP OP_HASH160 <pubKeyHash> OP_EQUALVERIFY OP_CHECKSIG
      if (
        data.readUInt8(1) !== 0xa9 ||
        data.readUInt8(data.length - 2) !== 0x88 ||
        data.readUInt8(data.length - 1) !== 0xac
      ) {
        throw Error('Unrecognised address format');
      }
      addr = Buffer.concat([Buffer.from([0x00]), data.slice(3, 3 + data.readUInt8(2))]);
      return bs58check.encode(addr);
    case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
      if (data.readUInt8(data.length - 1) !== 0x87) {
        throw Error('Unrecognised address format');
      }
      addr = Buffer.concat([Buffer.from([0x05]), data.slice(2, 2 + data.readUInt8(1))]);
      return bs58check.encode(addr);
    default:
      throw Error('Unrecognised address format');
  }
}

function decodeBase58Check(data: string): Buffer {
  const addr = bs58check.decode(data);
  switch (addr.readUInt8(0)) {
    case 0: // P2PKH
      return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), addr.slice(1), Buffer.from([0x88, 0xac])]);
    case 5: // P2SH
      return Buffer.concat([Buffer.from([0xa9, 0x14]), addr.slice(1), Buffer.from([0x87])]);
    default:
      throw Error('Unrecognised address format');
  }
}

const base58Chain = (name: string, coinType: number) => ({
  coinType,
  decoder: decodeBase58Check,
  encoder: encodeBase58Check,
  name,
});

function makeBech32Encoder(hrp: string): (data: Buffer) => string {
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

function makeBech32Decoder(hrp: string): (data: string) => Buffer {
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

function makeBitcoinEncoder(hrp: string): (data: Buffer) => string {
  const encodeBech32 = makeBech32Encoder(hrp);
  return (data: Buffer) => {
    try {
      return encodeBase58Check(data);
    } catch {
      return encodeBech32(data);
    }
  };
}

function makeBitcoinDecoder(hrp: string): (data: string) => Buffer {
  const decodeBech32 = makeBech32Decoder(hrp);
  return (data: string) => {
    if (data.toLowerCase().startsWith(hrp + '1')) {
      return decodeBech32(data);
    } else {
      return decodeBase58Check(data);
    }
  };
}

const bitcoinChain = (name: string, coinType: number, hrp: string) => ({
  coinType,
  decoder: makeBitcoinDecoder(hrp),
  encoder: makeBitcoinEncoder(hrp),
  name,
});

function encodeChecksummedHex(data: Buffer): string {
  return eip55.encode('0x' + data.toString('hex'));
}

function decodeChecksummedHex(data: string): Buffer {
  return Buffer.from(data.slice(2), 'hex');
}

const hexChecksumChain = (name: string, coinType: number) => ({
  coinType,
  decoder: decodeChecksummedHex,
  encoder: encodeChecksummedHex,
  name,
});

const formats: IFormat[] = [
  bitcoinChain('BTC', 0, 'bc'),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
  hexChecksumChain('RSK', 137),
  base58Chain('BCH', 145),
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
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);
