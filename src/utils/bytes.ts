export type ByteArray = Uint8Array

export function bytesToString(bytes: ByteArray): string {
  return new TextDecoder().decode(bytes)
}

export function stringToBytes(str: string): ByteArray {
  return new TextEncoder().encode(str)
}
