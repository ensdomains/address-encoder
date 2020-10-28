import {
  decode as bech32Decode,
  encode as bech32Encode,
  fromWords as bech32FromWords,
  toWords as bech32ToWords,
} from 'bech32';
import bigInt from 'big-integer';
import { decode as bs58DecodeNoCheck, encode as bs58EncodeNoCheck } from 'bs58';
// @ts-ignore
import { createHash } from 'crypto';
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

function steemAddressEncoder(data: Buffer): string {  
  const RIPEMD160 = require('ripemd160');

  const checksum = new RIPEMD160().update(data).digest();

  return 'STM' + bs58EncodeNoCheck(Buffer.concat([data, checksum.slice(0, 4)]));
}

function steemAddressDecoder(data: string): Buffer {
  const RIPEMD160 = require('ripemd160');

  const prefix = data.slice(0, 3);
  if (prefix !== 'STM') {
    throw Error('Unrecognised address format');
  }

  data = data.slice(3);

  const buffer: Buffer = bs58DecodeNoCheck(data);
  const checksum = buffer.slice(-4);
  const key = buffer.slice(0, -4);
  const checksumVerify = new RIPEMD160().update(key).digest().slice(0, 4);

  if(!checksumVerify.equals(checksum)) {
    throw Error('Invalid checksum');
  }

  return Buffer.from(key);
}

const AlgoChecksumByteLength = 4;
const AlgoAddressByteLength = 36;

// Returns 4 last byte (8 chars) of sha512_256(publicKey)
function algoChecksum(pk: Buffer): string {
  return createHash('SHA512-256')
    .update(pk)
    .digest('hex')
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

// Copyright (c) 2014-2018, MyMonero.com
//
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without modification, are
// permitted provided that the following conditions are met:
//
// 1. Redistributions of source code must retain the above copyright notice, this list of
//	conditions and the following disclaimer.
//
// 2. Redistributions in binary form must reproduce the above copyright notice, this list
//	of conditions and the following disclaimer in the documentation and/or other
//	materials provided with the distribution.
//
// 3. Neither the name of the copyright holder nor the names of its contributors may be
//	used to endorse or promote products derived from this software without specific
//	prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY
// EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
// THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
// PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
// INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT,
// STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF
// THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

var bs58Xmr = (function() {
	var b58: any = {};
	//
	var alphabet_str =
		"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
	var alphabet: number[] = [];
	for (var i = 0; i < alphabet_str.length; i++) {
		alphabet.push(alphabet_str.charCodeAt(i));
	}
	var encoded_block_sizes = [0, 2, 3, 5, 6, 7, 9, 10, 11];

	var alphabet_size = alphabet.length;
	var full_block_size = 8;
	var full_encoded_block_size = 11;

	var UINT64_MAX = bigInt(2).pow(64);

	function hextobin(hex: string) {
		if (hex.length % 2 !== 0) throw Error("Hex string has invalid length!");
		var res = new Uint8Array(hex.length / 2);
		for (var i = 0; i < hex.length / 2; ++i) {
			res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
		}
		return res;
	}

	function bintohex(bin: string | any[] | Uint8Array) {
		var out = [];
		for (var i = 0; i < bin.length; ++i) {
			out.push(("0" + bin[i].toString(16)).slice(-2));
		}
		return out.join("");
	}

	function strtobin(str: string) {
		var res = new Uint8Array(str.length);
		for (var i = 0; i < str.length; i++) {
			res[i] = str.charCodeAt(i);
		}
		return res;
	}

	function bintostr(bin: string | any[] | Uint8Array) {
		var out = [];
		for (var i = 0; i < bin.length; i++) {
			out.push(String.fromCharCode(bin[i]));
		}
		return out.join("");
	}

	function uint8_be_to_64(data: string | any[]) {
		if (data.length < 1 || data.length > 8) {
			throw Error("Invalid input length");
		}
		var res = bigInt.zero;
		var twopow8 = bigInt(2).pow(8);
		var i = 0;
		switch (9 - data.length) {
			case 1:
				res = res.add(data[i++]);
			case 2:
				res = res.multiply(twopow8).add(data[i++]);
			case 3:
				res = res.multiply(twopow8).add(data[i++]);
			case 4:
				res = res.multiply(twopow8).add(data[i++]);
			case 5:
				res = res.multiply(twopow8).add(data[i++]);
			case 6:
				res = res.multiply(twopow8).add(data[i++]);
			case 7:
				res = res.multiply(twopow8).add(data[i++]);
			case 8:
				res = res.multiply(twopow8).add(data[i++]);
				break;
			default:
				throw Error("Impossible condition");
		}
		return res;
	}

	function uint64_to_8be(num: { remainder: (arg0: any) => any; divide: (arg0: any) => any; }, size: number | Iterable<number>) {
		var res = new Uint8Array(<number>size);
		if (size < 1 || size > 8) {
			throw Error("Invalid input length");
		}
		var twopow8 = bigInt(2).pow(8);
		for (var i = <number>size - 1; i >= 0; i--) {
			res[i] = parseInt(num.remainder(twopow8).toString(), 10);
			num = num.divide(twopow8);
		}
		return res;
	}

	b58.encode_block = function(data: string | any[], buf: { [x: string]: number; }, index: number) {
		if (data.length < 1 || data.length > full_encoded_block_size) {
			throw Error("Invalid block length: " + data.length);
		}
		var num = uint8_be_to_64(data);
		var i = encoded_block_sizes[data.length] - 1;
		// while num > 0
		while (num.compare(0) === 1) {
			var div = num.divmod(alphabet_size);
			// remainder = num % alphabet_size
			var remainder = div.remainder;
			// num = num / alphabet_size
			num = div.quotient;
			buf[index + i] = alphabet[parseInt(remainder.toString(), 10)];
			i--;
		}
		return buf;
	};

	b58.encode = function(hex: any) {
		var data = hextobin(hex);
		if (data.length === 0) {
			return "";
		}
		var full_block_count = Math.floor(data.length / full_block_size);
		var last_block_size = data.length % full_block_size;
		var res_size =
			full_block_count * full_encoded_block_size +
			encoded_block_sizes[last_block_size];

		var res = new Uint8Array(res_size);
		var i;
		for (i = 0; i < res_size; ++i) {
			res[i] = alphabet[0];
		}
		for (i = 0; i < full_block_count; i++) {
			res = b58.encode_block(
				data.subarray(
					i * full_block_size,
					i * full_block_size + full_block_size,
				),
				res,
				i * full_encoded_block_size,
			);
		}
		if (last_block_size > 0) {
			res = b58.encode_block(
				data.subarray(
					full_block_count * full_block_size,
					full_block_count * full_block_size + last_block_size,
				),
				res,
				full_block_count * full_encoded_block_size,
			);
		}
		return bintostr(res);
	};

	b58.decode_block = function(data: string | any[], buf: { set: (arg0: Uint8Array, arg1: any) => void; }, index: any) {
		if (data.length < 1 || data.length > full_encoded_block_size) {
			throw Error("Invalid block length: " + data.length);
		}

		var res_size = encoded_block_sizes.indexOf(data.length);
		if (res_size <= 0) {
			throw Error("Invalid block size");
		}
		var res_num = bigInt(0);
		var order = bigInt(1);
		for (var i = data.length - 1; i >= 0; i--) {
			var digit = alphabet.indexOf(data[i]);
			if (digit < 0) {
				throw Error("Invalid symbol");
			}
			var product = order.multiply(digit).add(res_num);
			// if product > UINT64_MAX
			if (product.compare(UINT64_MAX) === 1) {
				throw Error("Overflow");
			}
			res_num = product;
			order = order.multiply(alphabet_size);
		}
		if (
			res_size < full_block_size &&
			bigInt(2).pow(8 * res_size).compare(res_num) <= 0
		) {
			throw Error("Overflow 2");
		}
		buf.set(uint64_to_8be(res_num, res_size), index);
		return buf;
	};

	b58.decode = function(enc: Uint8Array) {
		enc = strtobin(enc.toString());
		if (enc.length === 0) {
			return "";
		}
		var full_block_count = Math.floor(enc.length / full_encoded_block_size);
		var last_block_size = enc.length % full_encoded_block_size;
		var last_block_decoded_size = encoded_block_sizes.indexOf(
			last_block_size,
		);
		if (last_block_decoded_size < 0) {
			throw Error("Invalid encoded length");
		}
		var data_size =
			full_block_count * full_block_size + last_block_decoded_size;
		var data = new Uint8Array(data_size);
		for (var i = 0; i < full_block_count; i++) {
			data = b58.decode_block(
				enc.subarray(
					i * full_encoded_block_size,
					i * full_encoded_block_size + full_encoded_block_size,
				),
				data,
				i * full_block_size,
			);
		}
		if (last_block_size > 0) {
			data = b58.decode_block(
				enc.subarray(
					full_block_count * full_encoded_block_size,
					full_block_count * full_encoded_block_size +
						last_block_size,
				),
				data,
				full_block_count * full_block_size,
			);
		}
		return bintohex(data);
	};

	return b58;
})();

function xmrAddressEncoder(data: Buffer): string {
  return bs58Xmr.encode(data.toString('hex'));
}

function xmrAddressDecoder(data: string): Buffer {
  return Buffer.from(bs58Xmr.decode(data), 'hex');
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
  bitcoinBase58Chain('DASH', 5, [[0x4c]], [[0x10]]),
  bitcoinBase58Chain('PPC', 6, [[0x37]], [[0x75]]),
  getConfig('NMC', 7, bs58Encode, bs58Decode),
  bitcoinChain('MONA', 22, 'mona', [[0x32]], [[0x37], [0x05]]),
  getConfig('DCR', 42, bs58EncodeNoCheck, bs58DecodeNoCheck),
  getConfig('XEM', 43, b32encodeXemAddr, b32decodeXemAddr),
  hexChecksumChain('ETH', 60),
  hexChecksumChain('ETC', 61),
  getConfig('ICX', 74, icxAddressEncoder, icxAddressDecoder),
  bech32Chain('ATOM', 118, 'cosmos'),
  bech32Chain('ZIL', 119, 'zil'),
  bech32Chain('EGLD', 120, 'erd'),
  getConfig('XMR', 128, xmrAddressEncoder, xmrAddressDecoder),
  zcashChain('ZEC', 133, 'zs', [[0x1c, 0xb8]], [[0x1c, 0xbd]]),
  getConfig('LSK', 134, liskAddressEncoder, liskAddressDecoder),
  getConfig('STEEM', 135, steemAddressEncoder, steemAddressDecoder),
  hexChecksumChain('RSK', 137, 30),
  getConfig('XRP', 144, data => xrpCodec.encodeChecked(data), data => xrpCodec.decodeChecked(data)),
  getConfig('BCH', 145, encodeCashAddr, decodeBitcoinCash),
  getConfig('XLM', 148, strEncoder, strDecoder),
  getConfig('EOS', 194, eosAddrEncoder, eosAddrDecoder),
  getConfig('TRX', 195, bs58Encode, bs58Decode),
  getConfig('NEO', 239, bs58Encode, bs58Decode),
  getConfig('ALGO', 283, algoEncode, algoDecode),
  getConfig('DOT', 354, dotAddrEncoder, ksmAddrDecoder),
  getConfig('KSM', 434, ksmAddrEncoder, ksmAddrDecoder),
  getConfig('SOL', 501, bs58Encode, bs58Decode),
  hexChecksumChain('XDAI', 700),
  hexChecksumChain('VET', 703),
  bech32Chain('BNB', 714, 'bnb'),
  getConfig('HIVE', 825, steemAddressEncoder, steemAddressDecoder),
  getConfig('ONT', 1024, ontAddrEncoder, ontAddrDecoder),
  {
    coinType: 1729,
    decoder: tezosAddressDecoder,
    encoder: tezosAddressEncoder,
    name: 'XTZ',
  },
  bech32Chain('ADA', 1815, 'addr'),
  getConfig('QTUM', 2301, bs58Encode, bs58Decode),
  {
    coinType: 3030,
    decoder: hederaAddressDecoder,
    encoder: hederaAddressEncoder,
    name: 'HBAR',
  },
  getConfig('HNS', 5353, hnsAddressEncoder, hnsAddressDecoder),
  hexChecksumChain('CELO', 52752),
];

export const formatsByName: { [key: string]: IFormat } = Object.assign({}, ...formats.map(x => ({ [x.name]: x })));
export const formatsByCoinType: { [key: number]: IFormat } = Object.assign(
  {},
  ...formats.map(x => ({ [x.coinType]: x })),
);
