import {
  decode as bech32Decode,
  encode as bech32Encode,
  fromWords as bech32FromWords,
  toWords as bech32ToWords,
} from 'bech32';
import bigInt from 'big-integer';
import { blake2b } from 'blakejs'
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
import { sha512_256 } from 'js-sha512';
import { decode as nanoBase32Decode, encode as nanoBase32Encode } from 'nano-base32';
import  ripemd160  from 'ripemd160';
import { Keccak } from 'sha3';
import { filAddrDecoder, filAddrEncoder } from './filecoin/index';
import { xmrAddressDecoder, xmrAddressEncoder } from './monero/xmr-base58';

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
  };
}

const bech32Chain = (name: string, coinType: number, prefix: string) => ({
  coinType,
  decoder: makeBech32Decoder(prefix),
  encoder: makeBech32Encoder(prefix),
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
  return new Buffer(ss58Decode(data));
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
  bitcoinChain('DGB', 20, 'dgb', [[0x1e]], [[0x3f]]),
  bitcoinChain('MONA', 22, 'mona', [[0x32]], [[0x37], [0x05]]),
  getConfig('DCR', 42, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('XEM', 43, b32encodeXemAddr, b32decodeXemAddr),
  bitcoinBase58Chain('AIB', 55, [[0x17]], [[0x05]]),
  bitcoinChain('SYS', 57, 'sys', [[0x3f]], [[0x05]]),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
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
  eosioChain('EOS', 194, 'EOS'),
  getConfig('TRX', 195, bs58Encode, bs58Decode),
  getConfig('BCN', 204, bcnAddressEncoder, bcnAddressDecoder),
  eosioChain('FIO', 235, 'FIO'),
  getConfig('BSV', 236, bsvAddresEncoder, bsvAddressDecoder),
  getConfig('NEO', 239, bs58Encode, bs58Decode),
  hexChecksumChain('EWT', 246),
  getConfig('ALGO', 283, algoEncode, algoDecode),
  getConfig('IOST', 291, bs58EncodeNoCheck, bs58DecodeNoCheck),
  bitcoinBase58Chain('DIVI', 301, [[0x1e]], [[0xd]]),
  bech32Chain('IOTX', 304, 'io'),
  eosioChain('BTS', 308, 'BTS'),
  bech32Chain('CKB', 309, 'ckb'),
  bech32Chain('LUNA', 330, 'terra'),
  getConfig('DOT', 354, dotAddrEncoder, ksmAddrDecoder),
  getConfig('VSYS', 360, vsysAddressEncoder, vsysAddressDecoder),
  eosioChain('ABBC', 367, 'ABBC'),
  getConfig('ETN', 415, etnAddressEncoder, etnAddressDecoder),
  getConfig('AION', 425, aionEncoder, aionDecoder),
  getConfig('KSM', 434, ksmAddrEncoder, ksmAddrDecoder),
  getConfig('AE', 457, aeAddressEncoder, aeAddressDecoder),
  getConfig('FIL', 461, filAddrEncoder, filAddrDecoder),
  getConfig('AR', 472, arAddressEncoder, arAddressDecoder),
  bitcoinBase58Chain('CCA', 489, [[0x0b]], [[0x05]]),
  getConfig('SOL', 501, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('XHV', 535, xmrAddressEncoder, xmrAddressDecoder),
  bech32Chain('IRIS', 566, 'iaa'),
  bitcoinBase58Chain('LRG', 568, [[0x1e]], [[0x0d]]),
  getConfig('SERO', 569, seroAddressEncoder, seroAddressDecoder),
  getConfig('BDX', 570, xmrAddressEncoder, xmrAddressDecoder),
  bitcoinChain('CCXX', 571, 'ccx', [[0x89]], [[0x4b], [0x05]]),
  getConfig('SRM', 573, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('VLX', 574, bs58EncodeNoCheck, bs58DecodeNoCheck),
  bitcoinBase58Chain('BPS', 576, [[0x00]], [[0x05]]),
  hexChecksumChain('TFUEL', 589),
  hexChecksumChain('XDAI', 700),
  hexChecksumChain('VET', 703),
  bech32Chain('BNB', 714, 'bnb'),
  eosioChain('HIVE', 825, 'STM'),
  hexChecksumChain('TOMO', 889),
  getConfig('HNT', 904, hntAddresEncoder, hntAddressDecoder),
  bitcoinChain('BCD', 999, 'bcd', [[0x00]], [[0x05]]),
  bech32Chain('ONE', 1023, 'one'),
  getConfig('ONT', 1024, ontAddrEncoder, ontAddrDecoder),
  {
    coinType: 1729,
    decoder: tezosAddressDecoder,
    encoder: tezosAddressEncoder,
    name: 'XTZ',
  },
  bech32Chain('ADA', 1815, 'addr'),
  getConfig('QTUM', 2301, bs58Encode, bs58Decode),
  eosioChain('GXC', 2303, 'GXC'),
  getConfig('ELA', 2305, bs58EncodeNoCheck, bs58DecodeNoCheck),
  {
    coinType: 3030,
    decoder: hederaAddressDecoder,
    encoder: hederaAddressEncoder,
    name: 'HBAR',
  },
  getConfig('IOTA', 4218, bs58Encode, bs58Decode),
  getConfig('HNS', 5353, hnsAddressEncoder, hnsAddressDecoder),
  bech32Chain('AVAX', 9000, 'avax'),
  hexChecksumChain('NRG', 9797),
  getConfig('ARDR', 16754, ardrAddressEncoder, ardrAddressDecoder),
  hexChecksumChain('CELO', 52752),
  bitcoinBase58Chain('WICC', 99999, [[0x49]], [[0x33]]),
  getConfig('WAN', 5718350, wanChecksummedHexEncoder, wanChecksummedHexDecoder),
  getConfig('WAVES', 5741564, bs58EncodeNoCheck, wavesAddressDecoder),  
  
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);
