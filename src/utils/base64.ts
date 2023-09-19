export const b64Decode = (input: string): Uint8Array => {
  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

  const binaryString = atob(input);
  const output = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    output[i] = binaryString.charCodeAt(i);
  }

  return output;
};
