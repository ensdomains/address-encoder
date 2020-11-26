export class Address {
  public str: Buffer;
  constructor(str: Buffer) {
    if (!str || str.length < 1) { throw new Error('Missing str in address') }
    this.str = str
  }

  // https://beta.spec.filecoin.io/#appendix__address__protocol-indicator
  public protocol(): number {
    if (this.str.length < 1) {
      throw Error('No address found.')
    }

    return this.str[0]
  }

  public payload(): Buffer {
    if (this.str.length < 1) {
      throw Error('No address found.')
    }
    return this.str.slice(1, this.str.length)
  }
}
