export const base64Encode = (input: Uint8Array): string => {
  let binaryString = "";

  for (let i = 0; i < input.length; i++) {
    binaryString += String.fromCharCode(input[i]);
  }

  return btoa(binaryString);
};

export const base64Decode = (input: string): Uint8Array => {
  const binaryString = atob(input);
  const output = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    output[i] = binaryString.charCodeAt(i);
  }

  return output;
};
