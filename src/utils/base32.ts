const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const base32Lookup: number[] = alphabet.split("").reduce((acc, char, index) => {
  acc[char.charCodeAt(0)] = index;
  return acc;
}, [] as number[]);

export const base32Decode = (input: string): Uint8Array => {
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

export const base32Encode = (input: Uint8Array): string => {
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
