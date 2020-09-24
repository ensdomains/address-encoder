declare module 'bs58' {
        export function encode(data: Buffer): string;
        export function decode(data: string): Buffer;
}