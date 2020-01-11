declare module 'bs58grscheck' {
  export function encode(data: Buffer): string;
  export function decode(data: string): Buffer;
}
