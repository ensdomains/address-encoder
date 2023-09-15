const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const base32Lookup: number[] = alphabet.split("").reduce((acc, char, index) => {
  acc[char.charCodeAt(0)] = index;
  return acc;
}, [] as number[]);

export const b32Decode = (input: string): Uint8Array => {
  let buffer = 0;
  let bufferLength = 0;
  const output = new Uint8Array(Math.ceil((input.length * 5) / 8));

  let outputIndex = 0;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    const value = base32Lookup[charCode];

    if (value === undefined) {
      throw new Error("Invalid base32 character");
    }

    buffer = (buffer << 5) | value;
    bufferLength += 5;

    while (bufferLength >= 8) {
      output[outputIndex++] = (buffer >>> (bufferLength - 8)) & 255;
      bufferLength -= 8;
    }
  }

  return output.subarray(0, outputIndex);
};

export const b32Decode2 = (s: string): Uint8Array => {
  var r = new ArrayBuffer((s.length * 5) / 8);
  var b = new Uint8Array(r);
  for (var j = 0; j < s.length / 8; j++) {
    var v = [0, 0, 0, 0, 0, 0, 0, 0];
    for (var _i4 = 0; _i4 < 8; ++_i4) {
      v[_i4] = alphabet.indexOf(s[j * 8 + _i4]);
    }
    var i = 0;
    b[j * 5 + 0] = (v[i + 0] << 3) | (v[i + 1] >> 2);
    b[j * 5 + 1] = ((v[i + 1] & 0x3) << 6) | (v[i + 2] << 1) | (v[i + 3] >> 4);
    b[j * 5 + 2] = ((v[i + 3] & 0xf) << 4) | (v[i + 4] >> 1);
    b[j * 5 + 3] = ((v[i + 4] & 0x1) << 7) | (v[i + 5] << 2) | (v[i + 6] >> 3);
    b[j * 5 + 4] = ((v[i + 6] & 0x7) << 5) | v[i + 7];
  }
  return b;
};

export const b32Encode = (input: Uint8Array): string => {
  let buffer = 0;
  let bufferLength = 0;
  let output = "";

  for (let i = 0; i < input.length; i++) {
    buffer = (buffer << 8) | input[i];
    bufferLength += 8;

    while (bufferLength >= 5) {
      const index = (buffer >>> (bufferLength - 5)) & 31;
      output += alphabet[index];
      bufferLength -= 5;
    }
  }

  if (bufferLength > 0) {
    output += alphabet[(buffer << (5 - bufferLength)) & 31];
  }

  return output;
};
