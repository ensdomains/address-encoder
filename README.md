# address-encoder
This typescript library encodes and decodes address formats for various cryptocurrencies.

Text-format addresses are decoded into their native binary representations, and vice-versa. In the case of Bitcoin-derived chains, this means their scriptPubKey; for Ethereum-derived chains this is their hash.

This library was written for use with [EIP 2304](https://eips.ethereum.org/EIPS/eip-2304), but may be useful for anyone looking for a general purpose cryptocurrency address codec.

## Installation

### Using NPM

```
npm install --save @ensdomains/address-encoder
```

## Usage

```
import { formatsByName, formatsByCoinType } from '@ensdomains/address-encoder';

const data = formatsByName['BTC'].decoder('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa');
console.log(data.toString('hex')); // 76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac
const addr = formatsByCoinType[0].encoder(data);
console.log(addr); // 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
```

## Supported cryptocurrencies

This library currently supports the following cryptocurrencies and address formats:

 - BTC (base58check P2PKH and P2SH, and bech32 segwit)
 - LTC (base58check P2PHK and P2SH, and bech32 segwit)
 - DOGE (base58check P2PKH and P2SH)
 - DASH (base58check P2PKH and P2SH)
 - MONA (base58check P2PKH and P2SH, and bech32 segwit)
 - NEM (base32)
 - ETH (checksummed-hex)
 - ETC (checksummed-hex)
 - ATOM (bech32)
 - RSK (checksummed-hex)
 - XRP (base58check-ripple)
 - BCH (base58check and cashAddr; decodes to cashAddr)
 - XLM (ed25519 public key)
 - EOS (checksum encoded base58 public keys)
 - TRX (base58check)
 - XDAI (checksummed-hex)
 - BNB (bech32)


PRs to add additional chains and address types are welcome.
