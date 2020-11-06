interface Unsigned {
    encode(raw:string): Buffer;
    decode(raw:Buffer): string;
}

declare module 'leb128' {
    export const unsigned: Unsigned;
}
