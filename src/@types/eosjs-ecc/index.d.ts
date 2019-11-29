declare module 'eosjs-ecc' {

  export function PublicKey(Q: any, ...args: any[]): any;

  export namespace PublicKey {

    function fromHex(hex: any): any;
    function isValid(pubkey: any, ...args: any[]): any;

  }

}