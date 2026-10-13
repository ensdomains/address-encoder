export const encodeLeb128 = (source: bigint): Uint8Array => {
  const bytes: number[] = []
  let remaining = source
  do {
    let byte = Number(remaining & 127n)
    remaining >>= 7n
    if (remaining !== 0n) {
      byte = byte | 128
    }
    bytes.push(byte)
  } while (remaining !== 0n)
  return Uint8Array.from(bytes)
}

export const decodeLeb128 = (source: Uint8Array): bigint => {
  let result = 0n
  let shift = 0n
  for (const byte of source) {
    result |= BigInt(byte & 127) << shift
    if ((byte & 128) === 0) break
    shift += 7n
  }
  return result
}
