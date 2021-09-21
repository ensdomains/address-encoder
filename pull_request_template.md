<!--- Provide a general summary of your changes in the Title above -->
Enable Support for Chia (XCH)

## Issue number
<!--- If there is an associated github issues, please specify here -->

## Description
* Update bech32 to 2.0.0 (provides bech32m)
* Import bech32m (retain existing functionality for bech32)
* Check SLIP 44 for XCH coinType (8444)
* Add makeBech32m{encoder,decoder} function
* Add XCH entry 

## Reference to the specification
<!--- Please provide the reference link to specification. Please try to find the reference of the protocol specification , not just reference to a third party library as we cannot tell that also follows the specification -->
* Chia Implementation: https://github.com/Chia-Network/chia-blockchain/blob/main/chia/util/bech32m.py
* BIP 350: https://github.com/bitcoin/bips/blob/master/bip-0350.mediawiki

## Reference to the test address.
<!--- Please describe where you found the test address, either from the specificiation doc, test code of other repo, blockchain explorer, etc  -->
* Chia Test: https://github.com/Chia-Network/chia-blockchain/blob/main/tests/wallet/test_bech32m.py


## List of features added/changed
<!--- What types of changes does your code introduce? Put an `x` in all the boxes that apply: -->
* Update bech32 to 2.0.0 (provides bech32m)
* Add makeBech32m{encoder,decoder} function
- 

## How much has the filesize increased?
* Very minimal lines in `src/index.ts` (import, wrappers, XCH entry)
* Very minimal lines in `bech32 1.1.3 -> 2.0.0` (bech32m is just bech32 with different checksum)

## How Has This Been Tested?
<!--- Please describe in detail how you tested your changes. -->
<!--- Include details of your testing environment, tests ran to see how -->
<!--- your change affects other areas of the code, etc. -->
```
const bech32Lib = require(".");
const {encoder, decoder} = bech32Lib.formatsByName.XCH;

const a = 'xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj';
const b = decoder(a);
const c = encoder(b);

console.log([a, b.toString('hex'), c, a==c]);
```
Also added test to `src/__tests__/index.test.ts`

## Checklist:
<!--- Go over all the following points, and put an `x` in all the boxes that apply. -->
<!--- If you're unsure about any of these, don't hesitate to ask. We're here to help! -->
- [x] My code follows the code style of this project.
- [x] My code implements all the required features.
- [x] I have specified correct coinTypes specified at [Slip 44](https://github.com/satoshilabs/slips/blob/master/slip-0044.md)
- [x] I have provided the reference link to the specification I implemented.
- [x] I have provided enough explanation about how I provided the test address
