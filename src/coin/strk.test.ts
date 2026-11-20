import { describe, expect, test } from 'bun:test'
import { hexToBytes } from '@noble/hashes/utils'
import { decodeStrkAddress, encodeStrkAddress } from './strk.js'

describe.each([
  {
    text: '0x02Fd23d9182193775423497fc0c472E156C57C69E4089A1967fb288A2d84e914',
    hex: '02fd23d9182193775423497fc0c472e156c57c69e4089a1967fb288a2d84e914',
  },
  {
    // Ekubo Core on Starknet mainnet: three leading zero bytes
    text: '0x00000005dd3D2F4429AF886cD1a3b08289DBcEa99A294197E9eB43b0e0325b4b',
    hex: '00000005dd3d2f4429af886cd1a3b08289dbcea99a294197e9eb43b0e0325b4b',
  },
])('strk address', ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeStrkAddress(hexToBytes(hex))).toEqual(text)
  })
  test(`decode: ${text}`, () => {
    expect(decodeStrkAddress(text)).toEqual(hexToBytes(hex))
  })
})
