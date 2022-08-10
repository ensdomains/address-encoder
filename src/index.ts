import { bech32, bech32m } from 'bech32';
const {
  decode: bech32Decode,
  encode:  bech32Encode,
  fromWords: bech32FromWords,
  toWords: bech32ToWords
} = bech32;
import bigInt from 'big-integer';
import { blake2b, blake2bHex } from 'blakejs';
import { decode as bs58DecodeNoCheck, encode as bs58EncodeNoCheck } from 'bs58';
// @ts-ignore
import {
  b32decode,
  b32encode,
  bs58Decode,
  bs58Encode,
  cashaddrDecode,
  cashaddrEncode,
  codec as xrpCodec,
  decodeCheck as decodeEd25519PublicKey,
  encodeCheck as encodeEd25519PublicKey,
  eosPublicKey,
  hex2a,
  isValid as isValidXemAddress,
  isValidChecksumAddress as rskIsValidChecksumAddress,
  ss58Decode,
  ss58Encode,
  stripHexPrefix as rskStripHexPrefix,
  toChecksumAddress as rskToChecksumAddress,
} from 'crypto-addr-codec';
import { crc32 } from 'js-crc';
import { sha512_256 } from 'js-sha512';
import { decode as nanoBase32Decode, encode as nanoBase32Encode } from 'nano-base32';
import { Keccak, SHA3 } from 'sha3';
import { c32checkDecode, c32checkEncode } from './blockstack/stx-c32';
import { decode as cborDecode, encode as cborEncode, TaggedValue } from './cbor/cbor';
import { filAddrDecoder, filAddrEncoder } from './filecoin/index';
import { ChainID, isValidAddress } from './flow/index';
import { groestl_2 }  from './groestl-hash-js/index';
import { xmrAddressDecoder, xmrAddressEncoder } from './monero/xmr-base58';
import { nimqDecoder, nimqEncoder } from './nimq';
const SLIP44_MSB = 0x80000000
type EnCoder = (data: Buffer) => string;
type DeCoder = (data: string) => Buffer;

type base58CheckVersion = number[]

export interface IFormat {
  coinType: number;
  name: string;
  encoder: (data: Buffer) => string;
  decoder: (data: string) => Buffer;
}

// Support version field of more than one byte (e.g. Zcash)
function makeBitcoinBase58CheckEncoder(p2pkhVersion: base58CheckVersion, p2shVersion: base58CheckVersion): (data: Buffer) => string {
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
        addr = Buffer.concat([Buffer.from(p2pkhVersion), data.slice(3, 3 + data.readUInt8(2))]);
        // @ts-ignore
        return bs58Encode(addr);
      case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (data.readUInt8(data.length - 1) !== 0x87) {
          throw Error('Unrecognised address format');
        }
        addr = Buffer.concat([Buffer.from(p2shVersion), data.slice(2, 2 + data.readUInt8(1))]);
        return bs58Encode(addr);
      default:
        throw Error('Unrecognised address format');
    }
  };
}

// Supports version field of more than one byte
// NOTE: Assumes all versions in p2pkhVersions[] or p2shVersions[] will have the same length
function makeBitcoinBase58CheckDecoder(p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]): (data: string) => Buffer {
  return (data: string) => {
    const addr = bs58Decode(data);

    // Checks if the first addr bytes are exactly equal to provided version field
    const checkVersion = (version: base58CheckVersion) => {
      return version.every((value: number, index: number) => index < addr.length && value === addr.readUInt8(index))
    }
    if (p2pkhVersions.some(checkVersion)) {
      return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), addr.slice(p2pkhVersions[0].length), Buffer.from([0x88, 0xac])]);
    } else if (p2shVersions.some(checkVersion)) {
      return Buffer.concat([Buffer.from([0xa9, 0x14]), addr.slice(p2shVersions[0].length), Buffer.from([0x87])]);
    }
    throw Error('Unrecognised address format');
  };
}

const bitcoinBase58Chain = (name: string, coinType: number, p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]) => ({
  coinType,
  decoder: makeBitcoinBase58CheckDecoder(p2pkhVersions, p2shVersions),
  encoder: makeBitcoinBase58CheckEncoder(p2pkhVersions[0], p2shVersions[0]),
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

function makeBitcoinEncoder(hrp: string, p2pkhVersion: base58CheckVersion, p2shVersion: base58CheckVersion): (data: Buffer) => string {
  const encodeBech32 = makeBech32SegwitEncoder(hrp);
  const encodeBase58Check = makeBitcoinBase58CheckEncoder(p2pkhVersion, p2shVersion);
  return (data: Buffer) => {
    try {
      return encodeBase58Check(data);
    } catch {
      return encodeBech32(data);
    }
  };
}

function makeBitcoinDecoder(hrp: string, p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]): (data: string) => Buffer {
  const decodeBech32 = makeBech32SegwitDecoder(hrp);
  const decodeBase58Check = makeBitcoinBase58CheckDecoder(p2pkhVersions, p2shVersions);
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
  p2pkhVersions: base58CheckVersion[],
  p2shVersions: base58CheckVersion[],
) => ({
  coinType,
  decoder: makeBitcoinDecoder(hrp, p2pkhVersions, p2shVersions),
  encoder: makeBitcoinEncoder(hrp, p2pkhVersions[0], p2shVersions[0]),
  name,
});

// Similar to makeBitcoinEncoder but:
// - Uses Bech32 without SegWit https://zips.z.cash/zip-0173
// - Supports version field of more than one byte
function makeZcashEncoder(hrp: string, p2pkhVersion: base58CheckVersion, p2shVersion: base58CheckVersion): (data: Buffer) => string {
  const encodeBech32 = makeBech32Encoder(hrp);
  const encodeBase58Check = makeBitcoinBase58CheckEncoder(p2pkhVersion, p2shVersion);
  return (data: Buffer) => {
    try {
      return encodeBase58Check(data);
    } catch {
      return encodeBech32(data);
    }
  };
}

// Similar to makeBitcoinDecoder but uses makeZcashBase58CheckDecoder to support version field of more than one byte
function makeZcashDecoder(hrp: string, p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]): (data: string) => Buffer {
  const decodeBase58Check = makeBitcoinBase58CheckDecoder(p2pkhVersions, p2shVersions);
  const decodeBech32 = makeBech32Decoder(hrp);
  return (data: string) => {
    if (data.toLowerCase().startsWith(hrp)) {
      return decodeBech32(data);
    } else {
      return decodeBase58Check(data);
    }
  };
}

const zcashChain = (
  name: string,
  coinType: number,
  hrp: string,
  p2pkhVersions: base58CheckVersion[],
  p2shVersions: base58CheckVersion[],
) => ({
  coinType,
  decoder: makeZcashDecoder(hrp, p2pkhVersions, p2shVersions),
  encoder: makeZcashEncoder(hrp, p2pkhVersions[0], p2shVersions[0]),
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

function makeCardanoEncoder(hrp: string): (data: Buffer) => string {
  const encodeByron = makeCardanoByronEncoder();
  const encodeBech32 = makeBech32Encoder(hrp, 104);
  return (data: Buffer) => {
    try {
      return encodeByron(data);
    } catch {
      return encodeBech32(data);
    }
  }
}

function makeCardanoDecoder(hrp: string): (data: string) => Buffer {
  const decodeByron = makeCardanoByronDecoder();
  const decodeBech32 = makeBech32Decoder(hrp, 104);
  return (data: string) => {
    if (data.toLowerCase().startsWith(hrp)) {
      return decodeBech32(data);
    } else {
      return decodeByron(data);
    }
  };
}

function makeCardanoByronEncoder() {
  return (data: Buffer) => {
    const checksum = crc32(data);
    const taggedValue = new TaggedValue(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength), 24);

    const cborEncodedAddress = cborEncode([taggedValue, parseInt(checksum, 16)]);

    const address = bs58EncodeNoCheck(Buffer.from(cborEncodedAddress));

    if (!address.startsWith('Ae2') && !address.startsWith('Ddz')) {
      throw Error('Unrecognised address format');
    }

    return address;
   };
}

function makeCardanoByronDecoder() {
  return (data: string) => {
    const bytes = bs58DecodeNoCheck(data);
    const bytesAb = bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);

    const cborDecoded = cborDecode(bytesAb);

    const taggedAddr = cborDecoded[0];
    if(taggedAddr === undefined) {
      throw Error('Unrecognised address format');
    }

    const addrChecksum = cborDecoded[1];
    const calculatedChecksum = crc32(taggedAddr.value);

    if(parseInt(calculatedChecksum, 16) !== addrChecksum) {
      throw Error('Unrecognised address format');
    }

    return Buffer.from(taggedAddr.value);
  };
}


const cardanoChain = (
  name: string,
  coinType: number,
  hrp: string,
) => ({
  coinType,
  decoder: makeCardanoDecoder(hrp),
  encoder: makeCardanoEncoder(hrp),
  name,
});

function makeAvaxDecoder (hrp: string): (data: string) => Buffer {
  const decodeBech32 = makeBech32Decoder(hrp)
  return (data: string) => {
    let address
    const [id, possibleAddr] = data.split('-')
    if (!possibleAddr) { address = id }
    else { address = possibleAddr }

    return decodeBech32(address)
  }
}

function decodeNearAddr(data: string): Buffer {
  const regex = /(^(([a-z\d]+[\-_])*[a-z\d]+\.)*([a-z\d]+[\-_])*[a-z\d]+$)/g;
  if(!regex.test(data)) {
    throw Error('Invalid address string');
  } else {
    if(data.length > 64 || data.length < 2) {
      throw Error('Invalid address format');
    }
    return Buffer.from(data);
  }
}

function encodeNearAddr(data: Buffer): string {
  const ndata = data.toString();
  if(ndata.length > 64 || ndata.length < 2) {
    throw Error('Invalid address format');
  }
  return ndata;
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
  const decodeBase58Check = makeBitcoinBase58CheckDecoder([[0x00]], [[0x05]]);
  try {
    return decodeBase58Check(data);
  } catch {
    return decodeCashAddr(data);
  }
}

function grsCheckSumFn(buffer: Buffer): Buffer{
  const rtn : string = groestl_2(buffer, 1, 1) as string
  return Buffer.from(rtn)
}

function bs58grscheckEncode(payload:Buffer): string {
  const checksum = grsCheckSumFn(payload)
  return bs58EncodeNoCheck(Buffer.concat([
    payload,
    checksum
  ], payload.length + 4))
}
// Lifted from https://github.com/ensdomains/address-encoder/pull/239/commits/4872330fba558730108d7f1e0d197cfef3dd9ca6
// https://github.com/groestlcoin/bs58grscheck
function decodeRaw (buffer: Buffer): Buffer {
  const payload = buffer.slice(0, -4)
  const checksum = buffer.slice(-4)
  const newChecksum = grsCheckSumFn(payload)
  /* tslint:disable:no-bitwise */
  if (checksum[0] ^ newChecksum[0] |
      checksum[1] ^ newChecksum[1] |
      checksum[2] ^ newChecksum[2] |
      checksum[3] ^ newChecksum[3]) {return Buffer.from([])};
  /* tslint:enable:no-bitwise */
  return payload
}

function bs58grscheckDecode(str: string): Buffer {
  const buffer = bs58DecodeNoCheck(str);
  const payload = decodeRaw(buffer)
  if (payload.length === 0) {throw new Error('Invalid checksum');}
  return payload
}

function makeBase58GrsCheckEncoder(p2pkhVersion: base58CheckVersion, p2shVersion: base58CheckVersion): (data: Buffer) => string {
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
        addr = Buffer.concat([Buffer.from(p2pkhVersion), data.slice(3, 3 + data.readUInt8(2))]);
        return bs58grscheckEncode(addr);
      case 0xa9: // P2SH: OP_HASH160 <scriptHash> OP_EQUAL
        if (data.readUInt8(data.length - 1) !== 0x87) {
          throw Error('Unrecognised address format');
        }
        addr = Buffer.concat([Buffer.from(p2shVersion), data.slice(2, 2 + data.readUInt8(1))]);
        return bs58grscheckEncode(addr);
      default:
        throw Error('Unrecognised address format');
    }
  };
}

function makeBase58GrsCheckDecoder(p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]): (data: string) => Buffer {
  return (data: string) => {
    const addr = bs58grscheckDecode(data);
    const checkVersion = (version: base58CheckVersion) => {
      return version.every((value: number, index: number) => index < addr.length && value === addr.readUInt8(index))
    }
    if (p2pkhVersions.some(checkVersion)) {
      return Buffer.concat([Buffer.from([0x76, 0xa9, 0x14]), addr.slice(p2pkhVersions[0].length), Buffer.from([0x88, 0xac])]);
    } else if (p2shVersions.some(checkVersion)) {
      return Buffer.concat([Buffer.from([0xa9, 0x14]), addr.slice(p2shVersions[0].length), Buffer.from([0x87])]);
    }
    throw Error('Unrecognised address format');
  };
}

function makeGroestlcoinEncoder(hrp: string, p2pkhVersion: base58CheckVersion, p2shVersion: base58CheckVersion): (data: Buffer) => string {
  const encodeBech32 = makeBech32SegwitEncoder(hrp);
  const encodeBase58Check = makeBase58GrsCheckEncoder(p2pkhVersion, p2shVersion);
  return (data: Buffer) => {
    try {
      return encodeBase58Check(data);
    } catch {
      return encodeBech32(data);
    }
  };
}

function makeGroestlcoinDecoder(hrp: string, p2pkhVersions: base58CheckVersion[], p2shVersions: base58CheckVersion[]): (data: string) => Buffer {
  const decodeBech32 = makeBech32SegwitDecoder(hrp);
  const decodeBase58Check = makeBase58GrsCheckDecoder(p2pkhVersions, p2shVersions);
  return (data: string) => {
    if (data.toLowerCase().startsWith(hrp + '1')) {
      return decodeBech32(data);
    } else {
      return decodeBase58Check(data);
    }
  };
}

const groestlcoinChain = (
  name: string,
  coinType: number,
  hrp: string,
  p2pkhVersions: base58CheckVersion[],
  p2shVersions: base58CheckVersion[],
) => ({
  coinType,
  decoder: makeGroestlcoinDecoder(hrp, p2pkhVersions, p2shVersions),
  encoder: makeGroestlcoinEncoder(hrp, p2pkhVersions[0], p2shVersions[0]),
  name,
});

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

/* tslint:disable:no-bitwise */
export const convertEVMChainIdToCoinType = (chainId: number) =>{
  return  (SLIP44_MSB | chainId) >>> 0
}

/* tslint:disable:no-bitwise */
export const convertCoinTypeToEVMChainId = (coinType: number) =>{
  return  ((SLIP44_MSB -1) & coinType) >> 0
}

const evmChain = (name: string, coinType: number) => ({
  coinType: convertEVMChainIdToCoinType(coinType),
  decoder: makeChecksummedHexDecoder(),
  encoder: makeChecksummedHexEncoder(),
  name,
});

function makeBech32Encoder(prefix: string, limit?: number) {
  return (data: Buffer) => bech32Encode(prefix, bech32ToWords(data), limit);
}

function makeBech32Decoder(currentPrefix: string, limit?: number) {
  return (data: string) => {
    const { prefix, words } = bech32Decode(data, limit);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32FromWords(words));
  };
}

const bech32Chain = (name: string, coinType: number, prefix: string, limit?: number) => ({
  coinType,
  decoder: makeBech32Decoder(prefix, limit),
  encoder: makeBech32Encoder(prefix, limit),
  name,
});

function makeIotaBech32Encoder(prefix: string, limit?: number) {
  const bufferAddrVersion = Buffer.from([0o0]);
  return (data: Buffer) => bech32Encode(prefix, bech32ToWords(Buffer.concat([bufferAddrVersion, data])), limit);
}

function makeIotaBech32Decoder(currentPrefix: string, limit?: number) {
  return (data: string) => {
    const { prefix, words } = bech32Decode(data, limit);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32FromWords(words)).slice(1);
  };
}

function makeBech32mEncoder(prefix: string, limit?: number) {
  return (data: Buffer) => bech32m.encode(prefix, bech32m.toWords(data), limit);
}
function makeBech32mDecoder(currentPrefix: string, limit?: number) {
  return (data: string) => {
    const { prefix, words } = bech32m.decode(data, limit);
    if (prefix !== currentPrefix) {
      throw Error('Unrecognised address format');
    }
    return Buffer.from(bech32m.fromWords(words));
  };
}
const bech32mChain = (name: string, coinType: number, prefix: string, limit?: number) => ({
  coinType,
  decoder: makeBech32mDecoder(prefix, limit),
  encoder: makeBech32mEncoder(prefix, limit),
  name,
});

const iotaBech32Chain = (name: string, coinType: number, prefix: string, limit?: number) => ({
  coinType,
  decoder: makeIotaBech32Decoder(prefix, limit),
  encoder: makeIotaBech32Encoder(prefix, limit),
  name,
});

function makeEosioEncoder(prefix: string): (data: Buffer) => string {
  return (data: Buffer) => {
    if (!eosPublicKey.isValid(data)) {
      throw Error('Unrecognised address format');
    }
    const woPrefix = eosPublicKey.fromHex(data).toString();
    return woPrefix.replace(/^.{3}/g, prefix);
  }
}

function makeEosioDecoder(prefix: string): (data: string) => Buffer {
  return (data: string) => {
    if (!eosPublicKey.isValid(data)) {
      throw Error('Unrecognised address format');
    }
    const regex = new RegExp("^.{" + prefix.length + "}", "g");
    const wPrefix = data.replace(regex, 'EOS');
    return eosPublicKey(wPrefix).toBuffer();
  }
}

const eosioChain = (name: string, coinType: number, prefix: string) => ({
  coinType,
  decoder: makeEosioDecoder(prefix),
  encoder: makeEosioEncoder(prefix),
  name,
});

function b32encodeXemAddr(data: Buffer): string {
  return b32encode(hex2a(data.toString('hex')));
}

function b32decodeXemAddr(data: string): Buffer {
  if (!isValidXemAddress(data)) {
    throw Error('Unrecognised address format');
  }
  const address = data
    .toString()
    .toUpperCase()
    .replace(/-/g, '');
  return b32decode(address);
}

function ksmAddrEncoder(data: Buffer): string {
  return ss58Encode(Uint8Array.from(data), 2);
}

function dotAddrEncoder(data: Buffer): string {
  return ss58Encode(Uint8Array.from(data), 0);
}

function ksmAddrDecoder(data: string): Buffer {
  return Buffer.from(ss58Decode(data));
}

function ontAddrEncoder(data: Buffer): string {
  return bs58Encode(Buffer.concat([Buffer.from([0x17]), data]))
}

function ontAddrDecoder(data: string): Buffer {
  const address = bs58Decode(data)

  switch (address.readUInt8(0)) {
   case 0x17:
     return address.slice(1);

    default:
      throw Error('Unrecognised address format');
  }
}

function strDecoder(data: string): Buffer {
  return decodeEd25519PublicKey('ed25519PublicKey', data);
}

function strEncoder(data: Buffer): string {
  return encodeEd25519PublicKey('ed25519PublicKey', data);
}

// Referenced from the followings
// https://tezos.stackexchange.com/questions/183/base58-encoding-decoding-of-addresses-in-micheline
// https://tezos.gitlab.io/api/p2p.html?highlight=contract_id#contract-id-22-bytes-8-bit-tag
function tezosAddressEncoder(data: Buffer): string {
  if (data.length !== 22 && data.length !== 21) {
    throw Error('Unrecognised address format');
  }

  let prefix: Buffer;
  switch (data.readUInt8(0)) {
    case 0x00:
      if (data.readUInt8(1) === 0x00) {
        prefix = Buffer.from([0x06, 0xa1, 0x9f]); // prefix tz1 equal 06a19f
      } else if (data.readUInt8(1) === 0x01) {
        prefix = Buffer.from([0x06, 0xa1, 0xa1]); // prefix tz2 equal 06a1a1
      } else if (data.readUInt8(1) === 0x02) {
        prefix = Buffer.from([0x06, 0xa1, 0xa4]); // prefix tz3 equal 06a1a4
      } else {
        throw Error('Unrecognised address format');
      }
      return bs58Encode(Buffer.concat([prefix, data.slice(2)]));
    case 0x01:
      prefix = Buffer.from([0x02, 0x5a, 0x79]); // prefix KT1 equal 025a79
      return bs58Encode(Buffer.concat([prefix, data.slice(1, 21)]));
    default:
      throw Error('Unrecognised address format');
  }
}

function tezosAddressDecoder(data: string): Buffer {
  const address = bs58Decode(data).slice(3);
  switch (data.substring(0, 3)) {
    case 'tz1':
      return Buffer.concat([Buffer.from([0x00, 0x00]), address]);
    case 'tz2':
      return Buffer.concat([Buffer.from([0x00, 0x01]), address]);
    case 'tz3':
      return Buffer.concat([Buffer.from([0x00, 0x02]), address]);
    case 'KT1':
      return Buffer.concat([Buffer.from([0x01]), address, Buffer.from([0x00])]);
    default:
      throw Error('Unrecognised address format');
  }
}

// Reference from js library:
// https://github.com/hashgraph/hedera-sdk-java/blob/120d98ac9cd167db767ed77bb52cefc844b09fc9/src/main/java/com/hedera/hashgraph/sdk/SolidityUtil.java#L26
function hederaAddressEncoder(data: Buffer): string {
  if (data.length !== 20) {
    throw Error('Unrecognised address format');
  }

  const view = new DataView(data.buffer, 0);

  const shard = view.getUint32(0);
  const realm = view.getBigUint64(4);
  const account = view.getBigUint64(12);

  return [shard, realm, account].join('.');
}

// Reference from js library:
// https://github.com/hashgraph/hedera-sdk-java/blob/120d98ac9cd167db767ed77bb52cefc844b09fc9/src/main/java/com/hedera/hashgraph/sdk/SolidityUtil.java#L26
function hederaAddressDecoder(data: string): Buffer {
  const buffer = Buffer.alloc(20);
  const view = new DataView(buffer.buffer, 0, 20);

  const components = data.split('.');
  if (components.length !== 3) {
    throw Error('Unrecognised address format');
  }

  const shard = Number(components[0]);
  const realm = BigInt(components[1]);
  const account = BigInt(components[2]);

  view.setUint32(0, shard);
  view.setBigUint64(4, realm);
  view.setBigUint64(12, account);

  return buffer;
}

// Reference from Lisk validator
// https://github.com/LiskHQ/lisk-sdk/blob/master/elements/lisk-validator/src/validation.ts#L202
function validateLiskAddress(address: string) {
  if (address.length < 2 || address.length > 22) {
    throw new Error('Address length does not match requirements. Expected between 2 and 22 characters.');
  }

  if (address[address.length - 1] !== 'L') {
    throw new Error('Address format does not match requirements. Expected "L" at the end.');
  }

  if (address.includes('.')) {
    throw new Error('Address format does not match requirements. Address includes invalid character: `.`.');
  }
}

function liskAddressEncoder(data: Buffer): string {
  const address = `${bigInt(data.toString('hex'), 16).toString(10)}L`;

  return address;
}

function liskAddressDecoder(data: string): Buffer {
  validateLiskAddress(data);

  return Buffer.from(bigInt(data.slice(0, -1)).toString(16), 'hex');
}

function seroAddressEncoder(data: Buffer): string {
  const address =  bs58EncodeNoCheck(data);

  return address;
}

function seroAddressDecoder(data: string): Buffer {
  const bytes = bs58DecodeNoCheck(data);
  if (bytes.length === 96) {
    return  bytes;
  }
  throw Error('Unrecognised address format');
}

// https://github.com/wanchain/go-wanchain/blob/develop/common/types.go
function wanToChecksumAddress(data: string): string {
  const strippedData = rskStripHexPrefix(data);
  const ndata = strippedData.toLowerCase();

  const hashed = new Keccak(256).update(Buffer.from(ndata)).digest();
  let  ret = '0x';
  const len = ndata.length;
  let hashByte;
  for(let i = 0; i < len; i++) {
    hashByte = hashed[Math.floor(i / 2)];

    if (i % 2 === 0) {
      /* tslint:disable:no-bitwise */
      hashByte = hashByte >> 4;
    } else {
      /* tslint:disable:no-bitwise */
      hashByte &= 0xf;
      /* tslint:enable:no-bitwise */
    }

    if(ndata[i] > '9' && hashByte <= 7) {
      ret += ndata[i].toUpperCase();
    } else {
      ret += ndata[i];
    }
  }
  return ret;
}

function isValidChecksumWanAddress(address: string ): boolean {
  const isValid: boolean = /^0x[0-9a-fA-F]{40}$/.test(address);
  return isValid && (wanToChecksumAddress(address) === address)
}

function wanChecksummedHexEncoder(data: Buffer): string {
  return wanToChecksumAddress('0x'+data.toString('hex'));
}

function wanChecksummedHexDecoder(data: string): Buffer {
  if(isValidChecksumWanAddress(data)) {
    return Buffer.from(rskStripHexPrefix(data), 'hex');

  } else {
    throw Error('Invalid address checksum');

  }

}

function calcCheckSum(withoutChecksum: Buffer): Buffer {
  const checksum = (new Keccak(256).update(Buffer.from(blake2b(withoutChecksum, null, 32))).digest()).slice(0, 4);
  return checksum;
}

function isByteArrayValid(addressBytes: Buffer): boolean {
  // "M" for mainnet, "T" for test net. Just limited to mainnet
  if(addressBytes.readInt8(0) !== 5 || addressBytes.readInt8(1) !== "M".charCodeAt(0) || addressBytes.length !== 26) {
    return false;
  }

  const givenCheckSum = addressBytes.slice(-4);
  const generatedCheckSum = calcCheckSum(addressBytes.slice(0 , -4));
  return givenCheckSum.equals(generatedCheckSum);
}

// Reference:
// https://github.com/virtualeconomy/v-systems/blob/master/src/main/scala/vsys/account/Address.scala
function vsysAddressDecoder(data: string): Buffer {
  let base58String = data;
  if(data.startsWith('address:')){
    base58String = data.substr(data.length);
  }
  if(base58String.length > 36) {
    throw new Error('VSYS: Address length should not be more than 36');
  }
  const bytes = bs58DecodeNoCheck(base58String);

  if(!isByteArrayValid(bytes)) {
    throw new Error('VSYS: Invalid checksum');
  }
  return bytes;
}

function vsysAddressEncoder(data: Buffer): string {
  if(!isByteArrayValid(data)) {
    throw new Error('VSYS: Invalid checksum');
  }
  return bs58EncodeNoCheck(data);
}

// Reference:
// https://github.com/handshake-org/hsd/blob/c85d9b4c743a9e1c9577d840e1bd20dee33473d3/lib/primitives/address.js#L297
function hnsAddressEncoder(data: Buffer): string {
  if (data.length !== 20) {
    throw Error('P2WPKH must be 20 bytes');
  }

  const version = 0;
  const words = [version].concat(bech32ToWords(data));
  return bech32Encode('hs', words);
}

// Reference:
// https://github.com/handshake-org/hsd/blob/c85d9b4c743a9e1c9577d840e1bd20dee33473d3/lib/primitives/address.js#L225
function hnsAddressDecoder(data: string): Buffer {
  const { prefix, words } = bech32Decode(data);

  if (prefix !== 'hs') {
    throw Error('Unrecognised address format');
  }

  const version = words[0];
  const hash = bech32FromWords(words.slice(1));

  if (version !== 0) {
    throw Error('Bad program version');
  }

  if (hash.length !== 20) {
    throw Error('Witness program hash is the wrong size');
  }

  return Buffer.from(hash);
}

function nasAddressEncoder(data: Buffer): string {
  const checksum = (new SHA3(256).update(data).digest()).slice(0, 4);

  return bs58EncodeNoCheck(Buffer.concat([data, checksum]));
}

function nasAddressDecoder(data: string): Buffer {
  const buf = bs58DecodeNoCheck(data);

  if(buf.length !== 26 || buf[0] !== 25 || (buf[1] !== 87 && buf[1] !== 88)){
    throw Error('Unrecognised address format');
  }

  const bufferData = buf.slice(0, 22);
  const checksum = buf.slice(-4);
  const checksumVerify = (new SHA3(256).update(bufferData).digest()).slice(0, 4);

  if(!checksumVerify.equals(checksum)) {
    throw Error('Invalid checksum');
  }

  return bufferData;
}

// Referenced from following
// https://github.com/icon-project/icon-service/blob/master/iconservice/base/address.py#L219
function icxAddressEncoder(data: Buffer): string {
  if (data.length !== 21) {
    throw Error('Unrecognised address format');
  }
  switch (data.readUInt8(0)) {
    case 0x00:
      return 'hx' + data.slice(1).toString('hex');
    case 0x01:
      return 'cx' + data.slice(1).toString('hex');
    default:
      throw Error('Unrecognised address format');
  }
}

// Referenced from following
// https://github.com/icon-project/icon-service/blob/master/iconservice/base/address.py#L238
function icxAddressDecoder(data: string): Buffer {
  const prefix = data.slice(0, 2)
  const body = data.slice(2)
  switch (prefix) {
    case 'hx':
      return Buffer.concat([Buffer.from([0x00]), Buffer.from(body, 'hex')]);
    case 'cx':
      return Buffer.concat([Buffer.from([0x01]), Buffer.from(body, 'hex')]);
    default:
      throw Error('Unrecognised address format');
  }
}

function hntAddresEncoder(data: Buffer): string {
  const buf = Buffer.concat([Buffer.from([0]), data]);

  return bs58Encode(buf);
}

function hntAddressDecoder(data: string): Buffer {
  const buf = bs58Decode(data);

  const version = buf[0];
  if(version !== 0x00){
    throw Error('Invalid version byte');
  }

  return buf.slice(1);
}

function wavesAddressDecoder(data: string): Buffer {
  const buffer = bs58DecodeNoCheck(data);

  if(buffer[0] !== 1) {
    throw Error('Bad program version');
  }

  if (buffer[1] !== 87 || buffer.length !== 26) {
    throw Error('Unrecognised address format');
  }

  const bufferData = buffer.slice(0, 22);
  const checksum = buffer.slice(22, 26);
  const checksumVerify = (new Keccak(256).update(Buffer.from(blake2b(bufferData, null, 32))).digest()).slice(0, 4);

  if(!checksumVerify.equals(checksum)) {
    throw Error('Invalid checksum');
  }

  return buffer;

}

const glog = [0, 0, 1, 18, 2, 5, 19, 11, 3, 29, 6, 27, 20, 8, 12, 23, 4, 10, 30, 17, 7, 22, 28, 26, 21, 25, 9, 16, 13, 14, 24, 15];
const gexp = [1, 2, 4, 8, 16, 5, 10, 20, 13, 26, 17, 7, 14, 28, 29, 31, 27, 19, 3, 6, 12, 24, 21, 15, 30, 25, 23, 11, 22, 9, 18, 1];
function gmult(a: number, b: number): number {
  if (a === 0 || b === 0) {return 0;}

  return gexp[(glog[a] + glog[b]) % 31];
}

function ardrCheckSum(codeword: number[]): boolean {
  let sum = 0;

  for (let i = 1; i < 5; i++) {
    let t = 0;
    for (let j = 0; j < 31; j++) {
      if (j > 12 && j < 27) {continue;}

      let pos = j;
      if (j > 26) {pos -= 14;}

      // tslint:disable-next-line:no-bitwise
      t ^= gmult(codeword[pos], gexp[(i * j) % 31]);

  }
    // tslint:disable-next-line:no-bitwise
    sum |= t;

  }
  return sum === 0;
}

const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
const cwmap = [3, 2, 1, 0, 7, 6, 5, 4, 13, 14, 15, 16, 12, 8, 9, 10, 11];

function ardrAddressDecoder(data: string): Buffer {
  const codeword = [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

  data = data.replace(/(^\s+)|(\s+$)/g, '').toUpperCase();
  const prefix = data.slice(0, 5);
  if (prefix !== 'ARDOR' || data.split("-").length !== 5) {
    throw Error('Unrecognised address format');
  } else {
    data = data.substr(data.indexOf("-"));
  }

  const clean = [];
  let count = 0;

  for (const char of data) {
    const pos = alphabet.indexOf(char);

    if (pos >= 0) {
      clean[count++] = pos;
      if (count > 17) {
        throw Error('Unrecognised address format');
      }
    }
  }

  for (let i = 0, j = 0; i < count; i++) {
    codeword[cwmap[j++]] = clean[i];
  }

  if (!ardrCheckSum(codeword)) {
    throw Error('Unrecognised address format');
  }

  return Buffer.from(codeword);
}


function ardrAddressEncoder(data: Buffer): string {
  const dataStr = data.toString('hex');
  const arr = [];

  for(let i = 0, j = 0; i < dataStr.length; i = i + 2) {
    arr[cwmap[j++]] = 16 * parseInt(dataStr[i], 16) + parseInt(dataStr[i + 1], 16);
  }

  let acc = "";
  const rtn = [];
  for(let i = 0; i < 17; i++) {
    if(arr[i] >= alphabet.length || arr.length !== 17) {
      throw Error('Unrecognised address format');
    }
    acc += alphabet[arr[i]];

    if(i < 12 && (i + 1) % 4 === 0 || i === 16 ) {
      rtn.push(acc);
      acc = "";
    }

  }
  return `ARDOR-${rtn.join("-")}`;

}

function bcnAddressEncoder(data: Buffer): string {
  const checksum = (new Keccak(256).update(data).digest()).slice(0, 4);

  return xmrAddressEncoder(Buffer.concat([data, checksum]));
}

function bcnAddressDecoder(data: string): Buffer {
  const buf = xmrAddressDecoder(data);

  const tag = buf.slice(0, -68).toString('hex');

  if(buf.length < 68 || (tag !== '06' && tag !== 'cef622')) {
    throw Error('Unrecognised address format');
  }

  const checksum = buf.slice(-4);
  const checksumVerify = (new Keccak(256).update(buf.slice(0, -4)).digest()).slice(0, 4);

  if(!checksumVerify.equals(checksum)) {
    throw Error('Invalid checksum');
  }

  return buf.slice(0, -4);
}

const AlgoChecksumByteLength = 4;
const AlgoAddressByteLength = 36;

// Returns 4 last byte (8 chars) of sha512_256(publicKey)
function algoChecksum(pk: Buffer): string {
  return sha512_256
    .update(pk)
    .hex()
    .substr(-AlgoChecksumByteLength * 2);
}

function algoDecode(data: string): Buffer {
  const decoded = b32decode(data);

  if (decoded.length !== AlgoAddressByteLength) {
    throw Error('Unrecognised address format');
  }

  const publicKey = decoded.slice(0, -AlgoChecksumByteLength);
  const checksum = decoded.slice(-AlgoChecksumByteLength);
  const expectedChecksum = algoChecksum(publicKey);

  if (checksum.toString('hex') !== expectedChecksum) {
    throw Error('Unrecognised address format');
  }

  return publicKey;
}

function algoEncode(data: Buffer): string {
  // Calculate publicKey checksum
  const checksum = algoChecksum(data);

  // Append publicKey and checksum
  const addr = b32encode(hex2a(data.toString('hex').concat(checksum)));

  // Removing the extra '='
  const cleanAddr = addr.replace(/=/g, '');
  return cleanAddr;
}

function arAddressEncoder(data: Buffer): string {
  return data.toString('base64')
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/\=/g, "");
}

function arAddressDecoder(data: string): Buffer {
  data = data.replace(/\-/g, "+").replace(/\_/g, "/");

  const padding = data.length % 4 === 0
    ? 0
    : 4 - (data.length % 4);

  data = data.concat("=".repeat(padding));

  return Buffer.from(data, 'base64');
}

function bsvAddresEncoder(data: Buffer): string {
  const buf = Buffer.concat([Buffer.from([0]), data]);

  return bs58Encode(buf);
}

function bsvAddressDecoder(data: string): Buffer {
  const buf = bs58Decode(data);

  if(buf.length !== 21) {
    throw Error('Unrecognised address format');
  }

  const version = buf[0];
  if(version !== 0x00){
    throw Error('Invalid version byte');
  }

  return buf.slice(1);
}

function aeAddressEncoder(data: Buffer): string {
  return 'ak_' + bs58Encode(data.slice(2));
}

function aeAddressDecoder(data: string): Buffer {
  return Buffer.concat([Buffer.from('0x'), bs58Decode(data.split('_')[1])]);
}

function arkAddressDecoder(data: string): Buffer {
  const buffer = bs58Decode(data);

  if (buffer[0] !== 23) {
    throw Error('Unrecognised address format');
  }

  return buffer;
}

function nanoAddressEncoder(data: Buffer): string {
  const encoded = nanoBase32Encode(Uint8Array.from(data));
  const checksum = blake2b(data, null, 5).reverse();
  const checksumEncoded = nanoBase32Encode(checksum);

  const address = `nano_${encoded}${checksumEncoded}`;

  return address;
}

function nanoAddressDecoder(data: string): Buffer {
  const decoded = nanoBase32Decode(data.slice(5));

  return Buffer.from(decoded).slice(0, -5);
}

function etnAddressEncoder(data: Buffer): string {
  const buf = Buffer.concat([Buffer.from([18]), data]);

  const checksum = (new Keccak(256).update(buf).digest()).slice(0, 4);

  return xmrAddressEncoder(Buffer.concat([buf, checksum]));
}

function etnAddressDecoder(data: string): Buffer {
  const buf = xmrAddressDecoder(data);

  if(buf[0] !== 18){
    throw Error('Unrecognised address format');
  }

  const checksum = buf.slice(65, 69);
  const checksumVerify = (new Keccak(256).update(buf.slice(0, 65)).digest()).slice(0, 4);

  if(!checksumVerify.equals(checksum)) {
    throw Error('Invalid checksum');
  }

  return buf.slice(1, 65);
}

function zenEncoder(data: Buffer): string {
  if (
    !data.slice(0, 2).equals(Buffer.from([0x20, 0x89])) && // zn
    !data.slice(0, 2).equals(Buffer.from([0x1c, 0xb8])) && // t1
    !data.slice(0, 2).equals(Buffer.from([0x20, 0x96])) && // zs
    !data.slice(0, 2).equals(Buffer.from([0x1c, 0xbd])) && // t3
    !data.slice(0, 2).equals(Buffer.from([0x16, 0x9a])) // zc
  ) {
    throw Error('Unrecognised address format');
  }

  return bs58Encode(data);
}

function zenDecoder(data: string): Buffer {
  if (
    !data.startsWith('zn') &&
    !data.startsWith('zs') &&
    !data.startsWith('zc') &&
    !data.startsWith('t1') &&
    !data.startsWith('t3')
  ) {
    throw Error('Unrecognised address format');
  }

  return bs58Decode(data);
}

function aionDecoder(data: string): Buffer {
  let address = data;

  if (address == null || address.length === 0 || address.length < 64) {
    throw Error('Unrecognised address format');
  }

  if (address.startsWith('0x')) {
    address = address.slice(2);
  }

  if (address.startsWith('a0')) {
    if (address.length !== 64 || !address.substring(2).match('^[0-9A-Fa-f]+$')) {
      throw Error('Unrecognised address format');
    }
  }

  return Buffer.from(address, 'hex');
}

function aionEncoder(data: Buffer): string {
  return '0x'.concat(data.toString('hex'));
}

// Remove staring zeros from buffer
function flowDecode(data: string): Buffer {
  if (!isValidAddress(BigInt(data), ChainID.mainnet)) {
    throw Error('Unrecognised address format');
  }
  return Buffer.from(rskStripHexPrefix(data).replace(/^0+/, ''), 'hex');
}

// https://github.com/onflow/flow-go/blob/master/model/flow/address.go#L51
// If b is larger than 8, b will be cropped from the left.
// If b is smaller than 8, b will be appended by zeroes at the front.
function flowEncode(data: Buffer): string {
  const AddressLength = 8;
  let addrBytes = Buffer.alloc(AddressLength, 0x00);

  if (data.length > AddressLength) {
    addrBytes = data.slice(-AddressLength);
  }
  data.copy(addrBytes, AddressLength - data.length);

  return '0x' + addrBytes.toString('hex').toLowerCase();
}

/* tslint:disable:no-bitwise */
function nulsAddressEncoder(data: Buffer): string {
  const chainId = data[0] & 0xff | (data[1] & 0xff) << 8;
  const tempBuffer = Buffer.allocUnsafe(data.length + 1);

  let temp = 0;
  let xor = 0x00;
  for(let i = 0; i < data.length; i++) {
    temp = data[i];
    temp = temp > 127 ? temp - 256 : temp;
    tempBuffer[i] = temp;
    xor ^= temp;
  }
  tempBuffer[data.length] = xor;

  let prefix = "";
  if(1 === chainId) {
    prefix = 'NULS';
  } else if (2 === chainId) {
    prefix = 'tNULS';
  } else {
    const chainIdBuffer = Buffer.concat([Buffer.from([0xFF & chainId >> 0]), Buffer.from([0xFF & chainId >> 8])]);
    prefix = bs58EncodeNoCheck(chainIdBuffer).toUpperCase();
  }

  const constant = ['a', 'b', 'c', 'd', 'e'];
  return prefix + constant[prefix.length - 1] + bs58EncodeNoCheck(tempBuffer);
}

function nulsAddressDecoder(data: string): Buffer {
  if(data.startsWith('NULS')) {
    data = data.substring(5);
  } else if (data.startsWith('tNULS')) {
    data = data.substring(6);
  } else {
    for(let i = 0; i < data.length; i++) {
      const val = data.charAt(i);
      if(val.charCodeAt(0) >= 97) {
        data = data.substring(i + 1);
        break;
      }
    }
  }

  const bytes = bs58DecodeNoCheck(data);

  let temp = 0;
  let xor = 0x00;
  for(let i = 0; i < bytes.length - 1; i++) {
    temp = bytes[i];
    temp = temp > 127 ? temp - 256 : temp;
    bytes[i] = temp;
    xor ^= temp;
  }

  if(xor < 0) {
    xor = 256 + xor;
  }

  if(xor !== bytes[bytes.length - 1]) {
    throw Error('Unrecognised address format');
  }

  return bytes.slice(0, -1);
}
/* tslint:enable:no-bitwise */

const SIA_HASH_SIZE = 32;
const SIA_CHECKSUM_SIZE = 6;
const SIA_BLAKE2B_LEN = 32;

function siaAddressEncoder(data: Buffer): string {
  const checksum = blake2bHex(data, null, SIA_BLAKE2B_LEN).slice(0, SIA_CHECKSUM_SIZE * 2);
  return data.toString('hex') + checksum;
}

function siaAddressDecoder(data: string): Buffer {
  if (data.length !== (SIA_CHECKSUM_SIZE + SIA_HASH_SIZE) * 2) {
    throw Error('Unrecognised address format');
  }

  const hash = Buffer.from(data.slice(0, SIA_HASH_SIZE * 2), 'hex');
  const checksum = data.slice(SIA_HASH_SIZE * 2);
  const expectedChecksum = blake2bHex(hash, null, SIA_BLAKE2B_LEN).slice(0, SIA_CHECKSUM_SIZE * 2);

  if (checksum !== expectedChecksum) {
    throw Error('Unrecognised address format');
  }

  return hash;
}

const getConfig = (name: string, coinType: number, encoder: EnCoder, decoder: DeCoder) => {
  return {
    coinType,
    decoder,
    encoder,
    name,
  };
};

// Ordered by coinType
export const formats: IFormat[] = [
  bitcoinChain('BTC', 0, 'bc', [[0x00]], [[0x05]]),
  bitcoinChain('LTC', 2, 'ltc', [[0x30]], [[0x32], [0x05]]),
  bitcoinBase58Chain('DOGE', 3, [[0x1e]], [[0x16]]),
  bitcoinBase58Chain('RDD', 4, [[0x3d]], [[0x05]]),
  bitcoinBase58Chain('DASH', 5, [[0x4c]], [[0x10]]),
  bitcoinBase58Chain('PPC', 6, [[0x37]], [[0x75]]),
  getConfig('NMC', 7, bs58Encode, bs58Decode),
  bitcoinBase58Chain('VIA', 14, [[0x47]], [[0x21]]),
  groestlcoinChain('GRS', 17, 'grs', [[0x24]], [[0x05]]),
  bitcoinChain('DGB', 20, 'dgb', [[0x1e]], [[0x3f]]),
  bitcoinChain('MONA', 22, 'mona', [[0x32]], [[0x37], [0x05]]),
  getConfig('DCR', 42, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('XEM', 43, b32encodeXemAddr, b32decodeXemAddr),
  bitcoinBase58Chain('AIB', 55, [[0x17]], [[0x05]]),
  bitcoinChain('SYS', 57, 'sys', [[0x3f]], [[0x05]]),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC_LEGACY', 61),
  getConfig('ICX', 74, icxAddressEncoder, icxAddressDecoder),
  bitcoinBase58Chain('XVG',77, [[0x1E]], [[0x21]]),
  bitcoinBase58Chain('STRAT', 105, [[0x3F]], [[0x7D]]),
  getConfig('ARK', 111, bs58Encode, arkAddressDecoder),
  bech32Chain('ATOM', 118, 'cosmos'),
  bech32Chain('ZIL', 119, 'zil'),
  bech32Chain('EGLD', 120, 'erd'),
  getConfig('ZEN', 121, zenEncoder, zenDecoder),
  getConfig('XMR', 128, xmrAddressEncoder, xmrAddressDecoder),
  zcashChain('ZEC', 133, 'zs', [[0x1c, 0xb8]], [[0x1c, 0xbd]]),
  getConfig('LSK', 134, liskAddressEncoder, liskAddressDecoder),
  eosioChain('STEEM', 135, 'STM'),
  bitcoinBase58Chain('FIRO', 136, [[0x52]], [[0x07]]),
  hexChecksumChain('RSK', 137, 30),
  bitcoinBase58Chain('KMD', 141, [[0x3C]], [[0x55]]),
  getConfig('XRP', 144, data => xrpCodec.encodeChecked(data), data => xrpCodec.decodeChecked(data)),
  getConfig('BCH', 145, encodeCashAddr, decodeBitcoinCash),
  getConfig('XLM', 148, strEncoder, strDecoder),
  getConfig('BTM', 153, makeBech32SegwitEncoder('bm'), makeBech32SegwitDecoder('bm')),
  bitcoinChain('BTG', 156, 'btg', [[0x26]], [[0x17]]),
  getConfig('NANO', 165, nanoAddressEncoder, nanoAddressDecoder),
  bitcoinBase58Chain('RVN', 175, [[0x3c]], [[0x7a]]),
  hexChecksumChain('POA_LEGACY', 178),
  bitcoinChain('LCC', 192, 'lcc', [[0x1c]], [[0x32], [0x05]]),
  eosioChain('EOS', 194, 'EOS'),
  getConfig('TRX', 195, bs58Encode, bs58Decode),
  getConfig('BCN', 204, bcnAddressEncoder, bcnAddressDecoder),
  eosioChain('FIO', 235, 'FIO'),
  getConfig('BSV', 236, bsvAddresEncoder, bsvAddressDecoder),
  getConfig('NEO', 239, bs58Encode, bs58Decode),
  getConfig('NIM', 242, nimqEncoder, nimqDecoder),
  hexChecksumChain('EWT_LEGACY', 246),
  getConfig('ALGO', 283, algoEncode, algoDecode),
  getConfig('IOST', 291, bs58EncodeNoCheck, bs58DecodeNoCheck),
  bitcoinBase58Chain('DIVI', 301, [[0x1e]], [[0xd]]),
  bech32Chain('IOTX', 304, 'io'),
  eosioChain('BTS', 308, 'BTS'),
  bech32Chain('CKB', 309, 'ckb'),
  getConfig('MRX', 326, bs58Encode, bs58Decode),
  bech32Chain('LUNA', 330, 'terra'),
  getConfig('DOT', 354, dotAddrEncoder, ksmAddrDecoder),
  getConfig('VSYS', 360, vsysAddressEncoder, vsysAddressDecoder),
  eosioChain('ABBC', 367, 'ABBC'),
  getConfig('NEAR', 397, encodeNearAddr, decodeNearAddr),
  getConfig('ETN', 415, etnAddressEncoder, etnAddressDecoder),
  getConfig('AION', 425, aionEncoder, aionDecoder),
  getConfig('KSM', 434, ksmAddrEncoder, ksmAddrDecoder),
  getConfig('AE', 457, aeAddressEncoder, aeAddressDecoder),
  bech32Chain('KAVA', 459, 'kava'),
  getConfig('FIL', 461, filAddrEncoder, filAddrDecoder),
  getConfig('AR', 472, arAddressEncoder, arAddressDecoder),
  bitcoinBase58Chain('CCA', 489, [[0x0b]], [[0x05]]),
  hexChecksumChain('THETA_LEGACY', 500),
  getConfig('SOL', 501, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('XHV', 535, xmrAddressEncoder, xmrAddressDecoder),
  getConfig('FLOW', 539, flowEncode, flowDecode),
  bech32Chain('IRIS', 566, 'iaa'),
  bitcoinBase58Chain('LRG', 568, [[0x1e]], [[0x0d]]),
  getConfig('SERO', 569, seroAddressEncoder, seroAddressDecoder),
  getConfig('BDX', 570, xmrAddressEncoder, xmrAddressDecoder),
  bitcoinChain('CCXX', 571, 'ccx', [[0x89]], [[0x4b], [0x05]]),
  getConfig('SRM', 573, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('VLX', 574, bs58EncodeNoCheck, bs58DecodeNoCheck),
  bitcoinBase58Chain('BPS', 576, [[0x00]], [[0x05]]),
  hexChecksumChain('TFUEL', 589),
  bech32Chain('GRIN', 592, 'grin'),
  hexChecksumChain('XDAI_LEGACY', 700),
  // VET uses same address format as Ethereum but it's not EVM chain and no chainId found on https://chainlist.org
  hexChecksumChain('VET', 703),
  bech32Chain('BNB', 714, 'bnb'),
  hexChecksumChain('CLO_LEGACY', 820),
  eosioChain('HIVE', 825, 'STM'),
  hexChecksumChain('TOMO_LEGACY', 889),
  getConfig('HNT', 904, hntAddresEncoder, hntAddressDecoder),
  bech32Chain('RUNE', 931, 'thor'),
  bitcoinChain('BCD', 999, 'bcd', [[0x00]], [[0x05]]),
  hexChecksumChain('TT_LEGACY', 1001),
  hexChecksumChain('FTM_LEGACY', 1007),
  bech32Chain('ONE', 1023, 'one'),
  getConfig('ONT', 1024, ontAddrEncoder, ontAddrDecoder),
  {
    coinType: 1729,
    decoder: tezosAddressDecoder,
    encoder: tezosAddressEncoder,
    name: 'XTZ',
  },
  cardanoChain('ADA', 1815, 'addr'),
  getConfig('SC', 1991, siaAddressEncoder, siaAddressDecoder),
  getConfig('QTUM', 2301, bs58Encode, bs58Decode),
  eosioChain('GXC', 2303, 'GXC'),
  getConfig('ELA', 2305, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('NAS', 2718, nasAddressEncoder, nasAddressDecoder),
  {
    coinType: 3030,
    decoder: hederaAddressDecoder,
    encoder: hederaAddressEncoder,
    name: 'HBAR',
  },
  iotaBech32Chain('IOTA', 4218, 'iota'),
  getConfig('HNS', 5353, hnsAddressEncoder, hnsAddressDecoder),
  getConfig('STX', 5757, c32checkEncode, c32checkDecode),
  hexChecksumChain('GO_LEGACY', 6060),
  bech32mChain('XCH', 8444, 'xch', 90),
  getConfig('NULS', 8964, nulsAddressEncoder, nulsAddressDecoder),
  getConfig('AVAX', 9000, makeBech32Encoder('avax'), makeAvaxDecoder('avax')),
  hexChecksumChain('NRG_LEGACY', 9797),
  getConfig('ARDR', 16754, ardrAddressEncoder, ardrAddressDecoder),
  zcashChain('ZEL', 19167, 'za', [[0x1c, 0xb8]], [[0x1c, 0xbd]]),
  hexChecksumChain('CELO_LEGACY', 52752),
  bitcoinBase58Chain('WICC', 99999, [[0x49]], [[0x33]]),
  getConfig('WAN', 5718350, wanChecksummedHexEncoder, wanChecksummedHexDecoder),
  getConfig('WAVES', 5741564, bs58EncodeNoCheck, wavesAddressDecoder),
  // EVM chainIds
  evmChain('OP', 10),
  evmChain('CRO', 25),
  evmChain('BSC', 56),
  evmChain('GO', 60),
  evmChain('ETC', 61),
  evmChain('TOMO', 88),
  evmChain('POA', 99),
  evmChain('XDAI', 100),
  evmChain('TT', 108),
  evmChain('MATIC', 137),
  evmChain('EWT', 246),
  evmChain('FTM', 250),
  evmChain('THETA', 361),
  evmChain('CLO', 820),
  evmChain('NRG', 39797),
  evmChain('ARB1', 42161),
  evmChain('CELO', 42220),
  evmChain('AVAXC', 43114)
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);
