interface Address {
    protocol(): string;
    payload(): Buffer;
    str: string;
}
declare module '@glif/filecoin-address' {
    export function decode(str: string): { prefix: string; words: number[] };
    export function encode(prefix: string, address:Address): Buffer;  
    export function newAddress(protocol:string, payload:Buffer): Address;
    export function newFromString(str: string): Address;
}
