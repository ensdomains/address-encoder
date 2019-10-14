declare module 'eip55' {
  export function encode(data: string): string;
  export function verify(data: string): boolean;
}
