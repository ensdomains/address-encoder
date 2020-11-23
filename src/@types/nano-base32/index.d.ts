declare module 'nano-base32' {
    export function decode(data: string): Uint8Array;
    export function encode(data: Uint8Array): string;
  }
  