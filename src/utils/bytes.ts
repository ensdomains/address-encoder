export type ByteArray = Uint8Array

export function bytesToString(bytes: ByteArray): string {
  return new TextDecoder().decode(bytes)
}

export function stringToBytes(str: string): ByteArray {
  return new TextEncoder().encode(str)
}

export function bytesToBase10(bytes: ByteArray): string {
  let bigInt = BigInt(0)
  for (let i = 0; i < bytes.length; i++) {
    bigInt = (bigInt << BigInt(8)) | BigInt(bytes[i])
  }
  return bigInt.toString(10)
}

export function base10ToBytes(base10: string): ByteArray {
  let bigInt = BigInt(base10)
  const bytes: number[] = []

  while (bigInt > 0) {
    bytes.unshift(Number(bigInt & BigInt(0xff)))
    bigInt >>= BigInt(8)
  }

  return new Uint8Array(bytes)
}
