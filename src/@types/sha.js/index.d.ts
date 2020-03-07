declare module 'sha.js/sha256' {
  import { Hash } from 'crypto';

  export default class Sha256 {
    public update(buffer: Buffer): Hash;
  }
}
