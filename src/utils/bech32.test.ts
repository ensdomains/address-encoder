import { describe, expect, test } from 'bun:test'
import { bytesToHex } from '@noble/hashes/utils'
import { createBech32SegwitDecoder } from './bech32.js'

const decodeBc = createBech32SegwitDecoder('bc')

describe('createBech32SegwitDecoder()', () => {
  // valid test vectors from BIP-350 that use the `bc` prefix
  test.each([
    {
      text: 'BC1QW508D6QEJXTDG4Y5R3ZARVARY0C5XW7KV8F3T4',
      hex: '0014751e76e8199196d454941c45d1b3a323f1433bd6',
    },
    {
      text: 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kt5nd6y',
      hex: '5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6',
    },
    { text: 'BC1SW50QGDZ25J', hex: '6002751e' },
    {
      text: 'bc1zw508d6qejxtdg4y5r3zarvaryvaxxpcs',
      hex: '5210751e76e8199196d454941c45d1b3a323',
    },
    {
      text: 'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0',
      hex: '512079be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798',
    },
  ])('decodes valid address $text', ({ text, hex }) => {
    expect(bytesToHex(decodeBc(text))).toEqual(hex)
  })

  // invalid test vectors from BIP-350 that use the `bc` prefix
  test.each([
    // v1 with a bech32 checksum
    'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqh2y7hd',
    'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx',
    // v16 with a bech32 checksum
    'BC1SW50QA3JX3S',
    // v0 with a bech32m checksum
    'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kemeawh',
    // invalid witness version
    'BC130XLXVLHEMJA6C4DQV22UAPCTQUPFHLXM9H8Z3K2E72Q4K9HCZ7VQ7ZWS8R',
    // invalid program length
    'bc1pw5dgrnzv',
    'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7v8n0nx0muaewav253zgeav',
    // invalid program length for witness version 0
    'BC1QR508D6QEJXTDG4Y5R3ZARVARYV98GJ9P',
    // mixed case
    'bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcZ7vqzk5jj0',
    // zero padding of more than 4 bits
    'bc1zw508d6qejxtdg4y5r3zarvaryvqyzf3du',
    // empty data section
    'bc1gmk9yu',
  ])('throws for invalid address %s', (text) => {
    expect(() => decodeBc(text)).toThrow()
  })

  test('throws for unexpected human-readable part', () => {
    expect(() =>
      decodeBc(
        'tb1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3q0sl5k7',
      ),
    ).toThrow('Unexpected human-readable part in bech32 encoded address')
  })
})
