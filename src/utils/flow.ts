// REF: https://github.com/ensdomains/address-encoder/pull/130#issuecomment-735935450

// [n,k,d]-Linear code parameters
// The linear code used in the account addressing is a [64,45,7]
// It generates a [64,45]-code, which is the space of Flow account addresses.
//
// n is the size of the code words in bits,
// which is also the size of the account addresses in bits.
const linearCodeN = 64;

// Columns of the parity-check matrix H of the [64,45]-code used for Flow addresses.
// H is a (n x p) matrix with coefficients in GF(2n, each column is converted into
// a big endian integer representation of the GF(2) column vector.
// H is used to verify a code word is a valid account address.
const parityCheckMatrixColumns: bigint[] = [
  0x00001n,
  0x00002n,
  0x00004n,
  0x00008n,
  0x00010n,
  0x00020n,
  0x00040n,
  0x00080n,
  0x00100n,
  0x00200n,
  0x00400n,
  0x00800n,
  0x01000n,
  0x02000n,
  0x04000n,
  0x08000n,
  0x10000n,
  0x20000n,
  0x40000n,
  0x7328dn,
  0x6689an,
  0x6112fn,
  0x6084bn,
  0x433fdn,
  0x42aabn,
  0x41951n,
  0x233cen,
  0x22a81n,
  0x21948n,
  0x1ef60n,
  0x1decan,
  0x1c639n,
  0x1bdd8n,
  0x1a535n,
  0x194acn,
  0x18c46n,
  0x1632bn,
  0x1529bn,
  0x14a43n,
  0x13184n,
  0x12942n,
  0x118c1n,
  0x0f812n,
  0x0e027n,
  0x0d00en,
  0x0c83cn,
  0x0b01dn,
  0x0a831n,
  0x0982bn,
  0x07034n,
  0x0682an,
  0x05819n,
  0x03807n,
  0x007d2n,
  0x00727n,
  0x0068en,
  0x0067cn,
  0x0059dn,
  0x004ebn,
  0x003b4n,
  0x0036an,
  0x002d9n,
  0x001c7n,
  0x0003fn,
];

export function validateFlowAddress(address: bigint): boolean {
  // Multiply the code word GF(2)-vector by the parity-check matrix
  let parity = 0n;
  for (let i = 0; i < linearCodeN; i++) {
    if ((address & 1n) === 1n) {
      parity = parity ^ parityCheckMatrixColumns[i];
    }
    address = address >> 1n;
  }
  return parity === 0n && address === 0n;
}
