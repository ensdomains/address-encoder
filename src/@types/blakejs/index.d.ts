declare module 'blakejs' {
    export function blake2b(input: Buffer, key: Uint8Array | null, outlen: number): Buffer;
    export function blake2bHex(input: Buffer, key: Uint8Array | null, outlen: number): string;
}
