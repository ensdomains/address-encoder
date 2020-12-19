// REF: https://github.com/ensdomains/address-encoder/pull/130#issuecomment-735935450

type Address = BigInt

// [n,k,d]-Linear code parameters
// The linear code used in the account addressing is a [64,45,7]
// It generates a [64,45]-code, which is the space of Flow account addresses.
//
// n is the size of the code words in bits,
// which is also the size of the account addresses in bits.
const linearCodeN = 64

// Columns of the parity-check matrix H of the [64,45]-code used for Flow addresses.
// H is a (n x p) matrix with coefficients in GF(2), each column is converted into
// a big endian integer representation of the GF(2) column vector.
// H is used to verify a code word is a valid account address.
const parityCheckMatrixColumns: BigInt[] = [
  BigInt(0x00001),
  BigInt(0x00002),
  BigInt(0x00004),
  BigInt(0x00008),
  BigInt(0x00010),
  BigInt(0x00020),
  BigInt(0x00040),
  BigInt(0x00080),
  BigInt(0x00100),
  BigInt(0x00200),
  BigInt(0x00400),
  BigInt(0x00800),
  BigInt(0x01000),
  BigInt(0x02000),
  BigInt(0x04000),
  BigInt(0x08000),
  BigInt(0x10000),
  BigInt(0x20000),
  BigInt(0x40000),
  BigInt(0x7328d),
  BigInt(0x6689a),
  BigInt(0x6112f),
  BigInt(0x6084b),
  BigInt(0x433fd),
  BigInt(0x42aab),
  BigInt(0x41951),
  BigInt(0x233ce),
  BigInt(0x22a81),
  BigInt(0x21948),
  BigInt(0x1ef60),
  BigInt(0x1deca),
  BigInt(0x1c639),
  BigInt(0x1bdd8),
  BigInt(0x1a535),
  BigInt(0x194ac),
  BigInt(0x18c46),
  BigInt(0x1632b),
  BigInt(0x1529b),
  BigInt(0x14a43),
  BigInt(0x13184),
  BigInt(0x12942),
  BigInt(0x118c1),
  BigInt(0x0f812),
  BigInt(0x0e027),
  BigInt(0x0d00e),
  BigInt(0x0c83c),
  BigInt(0x0b01d),
  BigInt(0x0a831),
  BigInt(0x0982b),
  BigInt(0x07034),
  BigInt(0x0682a),
  BigInt(0x05819),
  BigInt(0x03807),
  BigInt(0x007d2),
  BigInt(0x00727),
  BigInt(0x0068e),
  BigInt(0x0067c),
  BigInt(0x0059d),
  BigInt(0x004eb),
  BigInt(0x003b4),
  BigInt(0x0036a),
  BigInt(0x002d9),
  BigInt(0x001c7),
  BigInt(0x0003f),
];

/* tslint:disable:no-bitwise */

export function isValidAddress(address: Address, chain: ChainID): boolean {
  let codeWord: BigInt = address;
  codeWord = BigInt(codeWord) ^ BigInt(chain.codeword);

  if (codeWord === BigInt(0)) {
    return false;
  }

  // Multiply the code word GF(2)-vector by the parity-check matrix
  let parity = BigInt(0);
  for (let i = 0; i < linearCodeN; i++) {
    if ((BigInt(codeWord) & BigInt(1)) === BigInt(1)) {
      parity = BigInt(parity) ^ BigInt(parityCheckMatrixColumns[i]);
    }
    codeWord = BigInt(codeWord) >> BigInt(1);
  }
  return parity === BigInt(0) && codeWord === BigInt(0);
}

export class ChainID {
  public static mainnet = new ChainID(BigInt(0));
  public static testnet = new ChainID(BigInt(0x6834ba37b3980209));
  public static emulator = new ChainID(BigInt(0x1cb159857af02018));

  constructor(readonly codeword: BigInt) {}
}
