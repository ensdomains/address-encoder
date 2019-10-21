declare module 'bs58check' {
  export function encode(data: Buffer): string;
  export function decode(data: string): Buffer;
}
