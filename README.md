# @ensdomains/address-encoder

A cryptocurrency address encoder/decoder in TypeScript

Text-format addresses are decoded into their native binary representations, and vice-versa. In the case of Bitcoin-derived chains, this means their scriptPubKey; for Ethereum-derived chains this is their hash.

This library was written for use with [EIP 2304](https://eips.ethereum.org/EIPS/eip-2304), but may be useful for anyone looking for a general purpose cryptocurrency address codec.

EVM compatible chains are either specified using SLIP44 coinType or `0x80000000 | chainId` where 0x80000000 is msb (most significant bit) reserved at SLIP44 and no coin types exist in that range. This is to avoid number colision with th existing coin types.

Please read [the specification page for the more detail](https://docs.ens.domains/ens-improvement-proposals/ensip-11-evmchain-address-resolution#specification)

## Installation

```bash
bun add @ensdomains/address-encoder
```

## Getting Started

```ts
// Import coder getter
import { getCoderByCoinName } from "@ensdomains/address-encoder";

// Get the coder for the address you want to encode/decode
const btcCoder = getCoderByCoinName("btc");

// Decode the address
const decodedAddress = btcCoder.decode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
// Uint8Array(25) [ 118, 169, 20, 98, 233, 7, 177, 92, 191, 39, 213, 66, 83, 153, 235, 246, 240, 251, 80, 235, 184, 143, 24, 136, 172 ]

// Encode the address
const encodedAddress = btcCoder.encode(decodedAddress);
// 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

### Hex String Encoding

If the data you are encoding is a hex string rather than `Uint8Array`, you can use the included `hexToBytes()` to convert it to the correct type.

```ts
import { getCoderByCoinName } from "@ensdomains/address-encoder";
import { hexToBytes } from "@ensdomains/address-encoder/utils";

const btcCoder = getCoderByCoinName("btc");

// Convert hex encoded data to bytes
const dataAsBytes = hexToBytes(
  "0x76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac"
);
// Uint8Array(25) [ 118, 169, 20, 98, 233, 7, 177, 92, 191, 39, 213, 66, 83, 153, 235, 246, 240, 251, 80, 235, 184, 143, 24, 136, 172 ]

// Pass bytes to encoder
const encodedAddress = btcCoder.encode(dataAsBytes);
// 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

## Supported Cryptocurrencies

To view all the supported cryptocurrencies of this library, see [here](https://github.com/ensdomains/address-encoder/blob/master/docs/supported-cryptocurrencies.md).

## Additional Functionality

### Async Coder Getter

```ts
import { getCoderByCoinNameAsync } from "@ensdomains/address-encoder/async";

const btcCoder = await getCoderByCoinNameAsync("btc");
```

### Individual Coin Imports

```ts
import { btc } from "@ensdomains/address-encoder/coins";

const decodedAddress = btc.decode("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
const encodedAddress = btc.encode(decodedAddress);
```

### Individual Coder Function Imports

```ts
import {
  decodeBtcAddress,
  encodeBtcAddress,
} from "@ensdomains/address-encoder/coders";

const decodedAddress = decodeBtcAddress("1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa");
const encodedAddress = encodeBtcAddress(decodedAddress);
```

### EVM Chains

There are a variety of EVM chains supported, however none of them (except for ETH) are exported from `coins` or `coders`. If you want to individually import for an EVM chain, you can just use the `eth` import as a replacement.

## Contribution Guide

To add a coin to this library, or if you're interested in contributing in any other way, read the [contribution guide](https://github.com/ensdomains/address-encoder/blob/master/docs/contribution-guide.md) before submitting a PR.
