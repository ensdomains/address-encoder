import Bn from 'bn.js'
export type BigNumberish = string | number | Bn;

declare module 'starknet' {
    export function validateChecksumAddress(address: string): boolean ;
    export function getChecksumAddress(address: BigNumberish): string ;
}
