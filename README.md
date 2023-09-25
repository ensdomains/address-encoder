# @ensdomains/address-encoder

A cryptocurrency address encoder/decoder in TypeScript

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

## Supported Cryptocurrencies

To view all the supported cryptocurrencies of this library, see [here](https://github.com/ensdomains/address-encoder/blob/master/docs/supported-cryptocurrencies.md).

## Additional Functionality

### Async Coder Getter

```ts
import { getCoderByCoinNameAsync } from "@ensdomains/address-encoder/async";

const btcCoder = await getCoderByCoinName("btc");
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

## Contribution Guide

To add a coin to this library, or if you're interested in contributing in any other way, read the [contribution guide](https://github.com/ensdomains/address-encoder/blob/master/docs/contribution-guide.md) before submitting a PR.
