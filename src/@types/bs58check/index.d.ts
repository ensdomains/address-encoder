declare module 'bs58check' {
  import { Buffer } from 'safe-buffer';

  export function encode(data: Buffer): string;
  export function decode(data: string): Buffer;
}
