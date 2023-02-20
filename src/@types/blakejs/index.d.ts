declare module 'blakejs' {
    export function blake2b(input: string | Uint8Array, key: Uint8Array | null, outlen: number): Buffer;
    export function blake2bHex(input: string | Uint8Array, key: Uint8Array | null, outlen: number): string;
}
