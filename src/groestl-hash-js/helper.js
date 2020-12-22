'use strict';
// String functions

import { u64 } from './op.js';

export function int8ArrayToHexString(array) {
	let str = '';

	for (let i = 0; i < array.length; i++) {
		if (array[i] < 16) {
			str += '0' + array[i].toString(16);
		}
		else {
			str += array[i].toString(16);
		}
	}
	return str;
}

export function int32ArrayToHexString(array) {
	let str = '';
	let len = array.length;
	for (let i = 0; i < len; i++) {
		let s = array[i];
		if (s < 0) {
			s = 0xFFFFFFFF + array[i] + 1;
		}
		let l = s.toString(16);
		let padding = 8;
		while (l.length < padding) {
			l = "0" + l;
		}
		str += l;
	}
	return str;
}

export function hex2string(s) {
	for (let c = [], len = s.length, i = 0; i < len; i += 2) {
		c.push(String.fromCharCode(parseInt(s.substring(i, i + 2), 16))); }
	return c.join('');
}

export function hex2bytes(s) {
	for (let c = [], len = s.length, i = 0; i < len; i += 2) {
		c.push(parseInt(s.substring(i, i + 2), 16)); }
	return c;
}

export function string2bytes(s) {
	let len = s.length;
	let b = new Array(len);
	let i = 0;
	while (i < len) {
		b[i] = s.charCodeAt(i);
		i++;
	}
	return b;
}

export  function bytes2Int32Buffer(b) {
	if (!b) { return []; }
	/* tslint:disable:no-bitwise */
	let len = b.length ? (((b.length - 1) >>> 2) + 1) : 0;
	let buffer = new Array(len);
	let j = 0;
	while (j < len) {
		buffer[j] = (b[j * 4] << 24) | (b[j * 4 + 1] << 16) | (b[j * 4 + 2] << 8) | b[j * 4 + 3];
		j++;
	}
    /* tslint:enable:no-bitwise */
	return buffer;
}

export function bytes2Int64Buffer(b) {
	if (!b) { return []; }
	/* tslint:disable:no-bitwise */
	let len = b.length ? (((b.length - 1) >>> 3) + 1) : 0;
	let buffer = new Array(len);
	let j = 0;
	while (j < len) {
		buffer[j] = new u64((b[j * 8] << 24) | (b[j * 8 + 1] << 16) | (b[j * 8 + 2] << 8) | b[j * 8 + 3], (b[j * 8 + 4] << 24) | (b[j * 8 + 5] << 16) | (b[j * 8 + 6] << 8) | b[j * 8 + 7]);
		j++;
	}
	/* tslint:enable:no-bitwise */
	return buffer;
}

export function bytes2Int64BufferLeAligned(b) {
	if (!b) { return []; }
	/* tslint:disable:no-bitwise */
	let len =  b.length ? ((( b.length - 1) >>> 3) + 1) : 0;
	let buffer = new Array(len);
	let j = 0;
	while (j < len) {
		buffer[j] = new u64((b[j * 8 + 7] << 24) | (b[j * 8 + 6] << 16) | (b[j * 8 + 5] << 8) | b[j * 8 + 4], (b[j * 8 + 3] << 24) | (b[j * 8 + 2] << 16) | (b[j * 8 + 1] << 8) | b[j * 8]);
		j++;
	}
	/* tslint:enable:no-bitwise */
	return buffer;
}

export function bufferEncode64leAligned(buffer, offset, uint64) {
	/* tslint:disable:no-bitwise */
	buffer[offset + 7] = uint64.hi >>> 24;
	buffer[offset + 6] = uint64.hi >>> 16 & 0xFF;
	buffer[offset + 5] = uint64.hi >>> 8 & 0xFF;
	buffer[offset + 4] = uint64.hi & 0xFF;
	buffer[offset + 3] = uint64.lo >>> 24;
	buffer[offset + 2] = uint64.lo >>> 16 & 0xFF;
	buffer[offset + 1] = uint64.lo >>> 8 & 0xFF;
	buffer[offset + 0] = uint64.lo & 0xFF;
	/* tslint:enable:no-bitwise */
}

export  function bufferEncode64(buffer, offset, uint64) {
	/* tslint:disable:no-bitwise */
	buffer[offset] = uint64.hi >>> 24;
	buffer[offset + 1] = uint64.hi >>> 16 & 0xFF;
	buffer[offset + 2] = uint64.hi >>> 8 & 0xFF;
	buffer[offset + 3] = uint64.hi & 0xFF;
	buffer[offset + 4] = uint64.lo >>> 24;
	buffer[offset + 5] = uint64.lo >>> 16 & 0xFF;
	buffer[offset + 6] = uint64.lo >>> 8 & 0xFF;
	buffer[offset + 7] = uint64.lo & 0xFF;
	/* tslint:enable:no-bitwise */
}

export function int32Buffer2Bytes(b) {
	let buffer = new Array(b.length);
	let len = b.length;
	let i = 0;
	/* tslint:disable:no-bitwise */
	while (i < len) {
		buffer[i * 4] = (b[i] & 0xFF000000) >>> 24;
		buffer[i * 4 + 1] = (b[i] & 0x00FF0000) >>> 16;
		buffer[i * 4 + 2] = (b[i] & 0x0000FF00) >>> 8;
		buffer[i * 4 + 3] = (b[i] & 0x000000FF);
		i++;
	}
	/* tslint:enable:no-bitwise */
	return buffer;
}

export function string2Int32Buffer(s) {
	return bytes2Int32Buffer(string2bytes(s));
}

let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export  function b64Encode(input) {
	let output = "";
	let chr1;
	let chr2;
	let chr3;
	let enc1;
	let enc2;
	let enc3
	let enc4;
	let i = 0;

	while (i < input.length) {

		chr1 = input[i++];
		chr2 = input[i++];
		chr3 = input[i++];
        /* tslint:disable:no-bitwise */
		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;
        /* tslint:enable:no-bitwise */
		if (isNaN(chr2)) {
			enc3 = enc4 = 64;
		}
		else if (isNaN(chr3)) {
			enc4 = 64;
		}

		output +=
			keyStr.charAt(enc1) + keyStr.charAt(enc2) +
			keyStr.charAt(enc3) + keyStr.charAt(enc4);
	}

	return output;
}

export function b64Decode(input) {
	let output = [];
	// @ts-ignore
	let chr1;
	let  chr2;
	let chr3;
	let enc1;
	let enc2;
	let enc3
	let enc4;
	let i = 0;

	input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

	while (i < input.length) {

		enc1 = keyStr.indexOf(input.charAt(i++));
		enc2 = keyStr.indexOf(input.charAt(i++));
		enc3 = keyStr.indexOf(input.charAt(i++));
		enc4 = keyStr.indexOf(input.charAt(i++));

		/* tslint:disable:no-bitwise */
		chr1 = (enc1 << 2) | (enc2 >> 4);
		chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
		chr3 = ((enc3 & 3) << 6) | enc4;
		/* tslint:enable:no-bitwise */

		output.push(chr1);

		if (enc3 !== 64) {
			output.push(chr2);
		}
		if (enc4 !== 64) {
			output.push(chr3);
		}
	}
	return output;
}