declare module '@glif/filecoin-address' {
    export function decode(str: string, limit?: number): { prefix: string; words: number[] };
    export function encode(prefix: string, words: number[], limit?: number): string;  
    export function newFromString(str: string, limit?: number): { prefix: string; words: number[] };
}