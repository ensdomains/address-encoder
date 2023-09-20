export const encodeLeb128 = (source: bigint): Uint8Array => {
  const bytes: number[] = [];
  do {
    let byte = Number(source & 127n);
    source >>= 7n;
    if (source != 0n) {
      byte = byte | 128;
    }
    bytes.push(byte);
  } while (source != 0n);
  return Uint8Array.from(bytes);
};

export const decodeLeb128 = (source: Uint8Array): bigint => {
  let result = 0n;
  let shift = 0n;
  for (const byte of source) {
    result |= BigInt(byte & 127) << shift;
    if ((byte & 128) === 0) break;
    shift += 7n;
  }
  return result;
};
