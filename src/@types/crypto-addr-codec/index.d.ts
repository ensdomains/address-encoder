declare module 'crypto-addr-codec' {
        export function b32encode(data: Buffer): string;
        export function b32decode(data: string): Buffer;
        export function hex2a(data: any): any;
        export function codec(data: any): any;
        export function encodeCheck(type: string, data: Buffer): string;
        export function decodeCheck(type: string, data: string): Buffer;
        export function calculateChecksum(data: any): any;

        // export function xrpCodex(data: any): any;
        export function ua2hex(data: any): any;
        export function isValidChecksumAddress(address: string, chainId: number | null): boolean;
        export function stripHexPrefix(address: string): string;
        export function toChecksumAddress(address: string, chainId: number | null): string;

        export function eosPublicKey(Q: any, ...args: any[]): any;

        export namespace eosPublicKey {
                function fromHex(hex: any): any;
                function isValid(pubkey: any, ...args: any[]): any;
        }

        export namespace codec {
                function decodeChecked(data: string): Buffer;
                function encodeChecked(data: Buffer): string;
        }

        export function ss58Encode(data: Uint8Array, format: number): string;
        export function ss58Decode(data: string): Buffer;

}