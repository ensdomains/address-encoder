// Ported from https://www.npmjs.com/package/@xmr-core/xmr-b58 to reduce file size

import bigInt from 'big-integer';

const b58: any = {};

const alphabet_str =
	"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const alphabet: number[] = [];
for (let i = 0; i < alphabet_str.length; i++) {
	alphabet.push(alphabet_str.charCodeAt(i));
}
const encoded_block_sizes = [0, 2, 3, 5, 6, 7, 9, 10, 11];

const alphabet_size = alphabet.length;
const full_block_size = 8;
const full_encoded_block_size = 11;

function hextobin(hex: string) {
	if (hex.length % 2 !== 0) {
		throw Error("Hex string has invalid length!");
	}
	const res = new Uint8Array(hex.length / 2);
	for (let i = 0; i < hex.length / 2; ++i) {
		res[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
	}
	return res;
}

function bintohex(bin: string | any[] | Uint8Array) {
	const out = [];
	for (let i = 0; i < bin.length; ++i) {
		out.push(("0" + bin[i].toString(16)).slice(-2));
	}
	return out.join("");
}

function strtobin(str: string) {
	const res = new Uint8Array(str.length);
	for (let i = 0; i < str.length; i++) {
		res[i] = str.charCodeAt(i);
	}
	return res;
}

function bintostr(bin: string | any[] | Uint8Array) {
	const out = [];
	for (let i = 0; i < bin.length; i++) {
		out.push(String.fromCharCode(bin[i]));
	}
	return out.join("");
}

function uint8_be_to_64(data: string | any[]) {
	if (data.length < 1 || data.length > 8) {
		throw Error("Invalid input length");
	}
	let res = bigInt.zero;
	const twopow8 = bigInt(2).pow(8);
	let i = 0;
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
	const res = new Uint8Array(<number>size);
	if (size < 1 || size > 8) {
		throw Error("Invalid input length");
	}
	const twopow8 = bigInt(2).pow(8);
	for (let i = <number>size - 1; i >= 0; i--) {
		res[i] = parseInt(num.remainder(twopow8).toString(), 10);
		num = num.divide(twopow8);
	}
	return res;
}

b58.encode_block = function (data: string | any[], buf: { [x: string]: number; }, index: number) {
	if (data.length < 1 || data.length > full_encoded_block_size) {
		throw Error("Invalid block length: " + data.length);
	}
	let num = uint8_be_to_64(data);
	let i = encoded_block_sizes[data.length] - 1;
	// while num > 0
	while (num.compare(0) === 1) {
		const div = num.divmod(alphabet_size);
		// remainder = num % alphabet_size
		const remainder = div.remainder;
		// num = num / alphabet_size
		num = div.quotient;
		buf[index + i] = alphabet[parseInt(remainder.toString(), 10)];
		i--;
	}
	return buf;
};

b58.decode_block = function (data: string | any[], buf: { set: (arg0: Uint8Array, arg1: any) => void; }, index: any) {
	if (data.length < 1 || data.length > full_encoded_block_size) {
		throw Error("Invalid block length: " + data.length);
	}

	const res_size = encoded_block_sizes.indexOf(data.length);
	if (res_size <= 0) {
		throw Error("Invalid block size");
	}
	let res_num = bigInt(0);
	let order = bigInt(1);
	for (let i = data.length - 1; i >= 0; i--) {
		const digit = alphabet.indexOf(data[i]);
		if (digit < 0) {
			throw Error("Invalid symbol");
		}
		const product = order.multiply(digit).add(res_num);
		// if product > UINT64_MAX
		if (product.compare(bigInt(2).pow(64)) === 1) {
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

export function xmrAddressEncoder(data: Buffer): string {
	const bin = hextobin(data.toString('hex'));
	if (bin.length === 0) {
		throw Error('Unrecognised address format');
	}
	const full_block_count = Math.floor(bin.length / full_block_size);
	const last_block_size = bin.length % full_block_size;
	const res_size =
		full_block_count * full_encoded_block_size +
		encoded_block_sizes[last_block_size];

	let res = new Uint8Array(res_size);
	let i;
	for (i = 0; i < res_size; ++i) {
		res[i] = alphabet[0];
	}
	for (i = 0; i < full_block_count; i++) {
		res = b58.encode_block(
			bin.subarray(
				i * full_block_size,
				i * full_block_size + full_block_size,
			),
			res,
			i * full_encoded_block_size,
		);
	}
	if (last_block_size > 0) {
		res = b58.encode_block(
			bin.subarray(
				full_block_count * full_block_size,
				full_block_count * full_block_size + last_block_size,
			),
			res,
			full_block_count * full_encoded_block_size,
		);
	}
	return bintostr(res);
};

export function xmrAddressDecoder(data: string): Buffer {
	const bin = strtobin(data);
	if (bin.length === 0) {
		throw Error('Unrecognised address format');
	}
	const full_block_count = Math.floor(bin.length / full_encoded_block_size);
	const last_block_size = bin.length % full_encoded_block_size;
	const last_block_decoded_size = encoded_block_sizes.indexOf(
		last_block_size,
	);
	if (last_block_decoded_size < 0) {
		throw Error("Invalid encoded length");
	}
	const data_size =
		full_block_count * full_block_size + last_block_decoded_size;
	let dataU = new Uint8Array(data_size);
	for (let i = 0; i < full_block_count; i++) {
		dataU = b58.decode_block(
			bin.subarray(
				i * full_encoded_block_size,
				i * full_encoded_block_size + full_encoded_block_size,
			),
			dataU,
			i * full_block_size,
		);
	}
	if (last_block_size > 0) {
		dataU = b58.decode_block(
			bin.subarray(
				full_block_count * full_encoded_block_size,
				full_block_count * full_encoded_block_size +
				last_block_size,
			),
			dataU,
			full_block_count * full_block_size,
		);
	}
	return Buffer.from(bintohex(dataU), 'hex');
};