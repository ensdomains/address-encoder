import { expect, test } from 'bun:test'
import * as coins from './coins.js'
import { nonEvmCoinNameToTypeMap } from './consts/coinNameToTypeMap.js'

const coinNames = Object.keys(nonEvmCoinNameToTypeMap)

test.each(coinNames)('coins.ts export - %s', (coinName) => {
  // biome-ignore lint/performance/noDynamicNamespaceImportAccess: checks every coin export by name
  const obj = coins[coinName]
  expect(obj).toBeObject()
  expect(obj.name).toBe(coinName)
  expect(obj.coinType).toBe(nonEvmCoinNameToTypeMap[coinName])
  expect(obj.encode).toBeFunction()
  expect(obj.decode).toBeFunction()
})
