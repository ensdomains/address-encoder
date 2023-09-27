## Contribution Guide

We welcome PRs to add additional chains and address types.

The hardest part of adding new cointype is to find out the address format of each coin. [Many coins derived from and share the same attributes as Bitcoin, Ethereum, and other popular blockchains](https://github.com/satoshilabs/slips/pull/1024/files). In that case, adding these coins can be as easy as a few lines of code. However, if the address format is unique and no js libraries available (or existing library file size too big), then you may have to port the encoding/verification from other languages into js by yourself, which could become time-consuming with lots of effort.

In either case, please follow the following guides and best practices.

## Reference where the address format is specified.

When we review your pull request, we conduct the following checks.

- The cointype correctly came from [SLIP 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md) (unless you add EVM chains). If you don't find your coin in the list, raise PR to add it ([example](https://github.com/satoshilabs/slips/pull/1024))
- Check coin address from block explorer and compare that the test addresses are in a similar format
- Read the reference code to see the pull request matches with the specification.

Please make sure that you include all the reference information so that we don't have to spend hours googling the relevant info which you must have done already.

## Reuse existing functions where necessary.

If there are reusable components, please reuse the function rather than duplicating the similar code.

## Avoid requiring big encoding/encryption library.

This library will be used in many mobile wallets where size bloat impacts the performance of the wallet. If your solution simply imports existing libraries, it may.

## Validate address format, not just encode/decode

Some specifications simply use base58 encoding without specific checksum. However, if there are any extra address format (such as address prefix or address length) exists, please also add that check so that we can prevent users from adding wrong coin address.
