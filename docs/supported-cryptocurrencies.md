## Supported Cryptocurrencies

### EVM Chains

The following EVM chains are supported:

| Chain ID | Name   | Full Name         | Coin Type  |
| -------- | ------ | ----------------- | ---------- |
| 10       | op     | Optimism          | 2147483658 |
| 25       | cro    | Cronos            | 2147483673 |
| 56       | bsc    | BNB Smart Chain   | 2147483704 |
| 60       | go     | GoChain           | 2147483708 |
| 61       | etc    | Ethereum Classic  | 2147483709 |
| 88       | tomo   | TomoChain         | 2147483736 |
| 99       | poa    | POA               | 2147483747 |
| 100      | gno    | Gnosis            | 2147483748 |
| 108      | tt     | ThunderCore       | 2147483756 |
| 137      | matic  | Polygon           | 2147483785 |
| 169      | manta  | Manta Pacific     | 2147483817 |
| 246      | ewt    | Energy Web        | 2147483894 |
| 250      | ftm    | Fantom Opera      | 2147483898 |
| 288      | boba   | Boba              | 2147483936 |
| 324      | zksync | zkSync            | 2147483972 |
| 361      | theta  | Theta             | 2147484009 |
| 820      | clo    | Callisto          | 2147484468 |
| 1088     | metis  | Metis             | 2147484736 |
| 5000     | mantle | Mantle            | 2147488648 |
| 8453     | base   | Base              | 2147492101 |
| 39797    | nrg    | Energi            | 2147523445 |
| 42161    | arb1   | Arbitrum One      | 2147525809 |
| 42220    | celo   | Celo              | 2147525868 |
| 43114    | avaxc  | Avalanche C-Chain | 2147526762 |
| 59144    | linea  | Linea             | 2147542792 |
| 534352   | scr    | Scroll            | 2148018000 |
| 7777777  | zora   | Zora              | 2155261425 |

### Legacy Coins

The following legacy coins are supported:

| Coin Type | Name        | Full Name        | Replacement Name | Replacement Coin Type |
| --------- | ----------- | ---------------- | ---------------- | --------------------- |
| 61        | etcLegacy   | Ethereum Classic | etc              | 2147483709            |
| 178       | poaLegacy   | POA              | poa              | 2147483747            |
| 246       | ewtLegacy   | Energy Web       | ewt              | 2147483894            |
| 500       | thetaLegacy | Theta            | theta            | 2147484009            |
| 574       | vlxLegacy   | Velas            | vlx              | 5655640               |
| 700       | gnoLegacy   | Gnosis           | gno              | 2147483748            |
| 820       | cloLegacy   | Callisto         | clo              | 2147484468            |
| 889       | tomoLegacy  | TomoChain        | tomo             | 2147483736            |
| 1001      | ttLegacy    | ThunderCore      | tt               | 2147483756            |
| 1007      | ftmLegacy   | Fantom           | ftm              | 2147483898            |
| 6060      | goLegacy    | GoChain          | go               | 2147483708            |
| 9797      | nrgLegacy   | Energi           | nrg              | 2147523445            |
| 52752     | celoLegacy  | Celo             | celo             | 2147525868            |

### Coins

The following coins are supported:

| Coin Type | Name  | Full Name           | Encoding Type                                                      |
| --------- | ----- | ------------------- | ------------------------------------------------------------------ |
| 0         | btc   | Bitcoin             | base58check P2PKH and P2SH, and bech32 segwit                      |
| 2         | ltc   | Litecoin            | base58check P2PHK and P2SH, and bech32 segwit                      |
| 3         | doge  | Dogecoin            | base58check P2PKH and P2SH                                         |
| 4         | rdd   | Reddcoin            | base58check P2PKH and P2SH                                         |
| 5         | dash  | Dash                | base58check P2PKH and P2SH                                         |
| 6         | ppc   | Peercoin            | base58check P2PKH and P2SH                                         |
| 7         | nmc   | Namecoin            | base58check                                                        |
| 14        | via   | Viacoin             | base58check P2PKH and P2SH                                         |
| 20        | dgb   | DigiByte            | base58check P2PKH and P2SH, and bech32 segwit                      |
| 22        | mona  | Monacoin            | base58check P2PKH and P2SH, and bech32 segwit                      |
| 42        | dcr   | Decred              | base58, no check                                                   |
| 43        | xem   | NEM                 | base32                                                             |
| 55        | aib   | AIB                 | base58check P2PKH and P2SH                                         |
| 57        | sys   | Syscoin             | base58check P2PKH and P2SH, and bech32 segwit                      |
| 60        | eth   | Ethereum            | checksummed-hex                                                    |
| 74        | icx   | ICON                | custom                                                             |
| 77        | xvg   | Verge               | base58check P2PKH and P2SH                                         |
| 105       | strat | Stratis             | base58check P2PKH and P2SH                                         |
| 111       | ark   | ARK                 | base58check                                                        |
| 118       | atom  | Atom                | bech32                                                             |
| 121       | zen   | Zencash             | base58check                                                        |
| 128       | xmr   | Monero              | base58xmr                                                          |
| 133       | zec   | Zcash               | base58check P2PKH and P2SH, bech32 (Sprout shielded not supported) |
| 134       | lsk   | Lisk                | hex with suffix                                                    |
| 135       | steem | Steem               | base58 + ripemd160-checksum                                        |
| 136       | firo  | Firo                | base58check P2PKH and P2SH                                         |
| 137       | rbtc  | RSK                 | checksummed-hex                                                    |
| 141       | kmd   | Komodo              | base58check                                                        |
| 144       | xrp   | Ripple              | base58check-ripple                                                 |
| 145       | bch   | Bitcoin Cash        | base58check and cashAddr; decodes to cashAddr                      |
| 148       | xlm   | Stellar Lumens      | ed25519 public key                                                 |
| 153       | btm   | Bytom               | bech32 segwit                                                      |
| 156       | btg   | Bitcoin Gold        | base58check P2PKH and P2SH, and bech32 segwit                      |
| 165       | nano  | Nano                | nano-base32                                                        |
| 175       | rvn   | Ravencoin           | base58check P2PKH and P2SH                                         |
| 192       | lcc   | LitecoinCash        | base58check P2PKH and P2SH, and bech32 segwit                      |
| 194       | eos   | EOS                 | base58 + ripemd160-checksum                                        |
| 195       | trx   | Tron                | base58check                                                        |
| 204       | bcn   | Bytecoin            | base58xmr                                                          |
| 235       | fio   | FIO                 | base58 + ripemd160-checksum                                        |
| 236       | bsv   | BitcoinSV           | base58check                                                        |
| 242       | nim   | Nimiq               | custom                                                             |
| 283       | algo  | Algorand            | checksummed-base32                                                 |
| 291       | iost  | IOST                | base58, no check                                                   |
| 301       | divi  | Divi Project        | base58check P2PKH and P2SH                                         |
| 304       | iotx  | IoTeX               | bech32                                                             |
| 308       | bts   | Bitshares           | base58 + ripemd160-checksum                                        |
| 309       | ckb   | Nervos CKB          | bech32                                                             |
| 313       | zil   | Zilliqa             | bech32                                                             |
| 326       | mrx   | Metrix Coin         | base58check                                                        |
| 330       | luna  | Terra               | bech32                                                             |
| 354       | dot   | Polkadot            | ss58                                                               |
| 360       | vsys  | V Systems           | custom                                                             |
| 367       | abbc  | ABBC                | base58 + ripemd160-checksum                                        |
| 397       | near  | NEAR Protocol       | custom                                                             |
| 415       | etn   | Electroneum         | base58xmr                                                          |
| 425       | aion  | Aion                | hex                                                                |
| 434       | ksm   | Kusama              | ss58                                                               |
| 457       | ae    | æternity            | base58check                                                        |
| 459       | kava  | Kava                | bech32                                                             |
| 461       | fil   | Filecoin            | base10 + leb128 and base32 + blake2b checksum                      |
| 472       | ar    | Arweave             | base64url                                                          |
| 489       | cca   | Counos              | base58check P2PKH and P2SH                                         |
| 501       | sol   | Solana              | base58, no check                                                   |
| 508       | egld  | MultiversX          | bech32                                                             |
| 535       | xhv   | Haven Protocol      | base58xmr                                                          |
| 539       | flow  | Flow                | hex                                                                |
| 566       | iris  | Irisnet             | bech32                                                             |
| 568       | lrg   | Large Coin          | base58check P2PKH and P2SH                                         |
| 569       | sero  | Super Zero Protocol | base58, no check                                                   |
| 570       | bdx   | Beldex              | base58xmr                                                          |
| 571       | ccxx  | Counos X            | base58check P2PKH and P2SH, and bech32 segwit                      |
| 573       | srm   | Serum               | base58, no check                                                   |
| 576       | bps   | BitcoinPoS          | base58check P2PKH and P2SH                                         |
| 589       | tfuel | Theta Fuel          | checksummed-hex                                                    |
| 592       | grin  | Grin                | base58check                                                        |
| 714       | bnb   | BNB                 | bech32                                                             |
| 818       | vet   | VeChain             | checksummed-hex                                                    |
| 825       | hive  | Hive                | base58 + ripemd160-checksum                                        |
| 888       | neo   | NEO                 | base58check                                                        |
| 904       | hnt   | Helium              | base58check                                                        |
| 931       | rune  | THORChain           | bech32                                                             |
| 999       | bcd   | Bitcoin Diamond     | base58check P2PKH and P2SH, and bech32 segwit                      |
| 1023      | one   | HARMONY-ONE         | bech32                                                             |
| 1024      | ont   | Ontology            | base58check                                                        |
| 1237      | nostr | Nostr               | bech32                                                             |
| 1729      | xtz   | Tezos               | base58check                                                        |
| 1815      | ada   | Cardano             | base58, no check + crc32-checksum and bech32                       |
| 1991      | sc    | Sia                 | blake2b checksum                                                   |
| 2301      | qtum  | QTUM                | base58check                                                        |
| 2303      | gxc   | GXChain             | base58 + ripemd160-checksum                                        |
| 2305      | ela   | Elastos             | base58                                                             |
| 2718      | nas   | Nebulas             | base58 + sha3-256-checksum                                         |
| 3030      | hbar  | Hedera HBAR         | custom                                                             |
| 4218      | iota  | IOTA                | iotaBech32                                                         |
| 5353      | hns   | Handshake           | custom                                                             |
| 5757      | stx   | Stacks              | crockford base32 P2PKH and P2SH + ripemd160-checksum               |
| 8444      | xch   | Chia                | bech32m                                                            |
| 8964      | nuls  | NULS                | base58                                                             |
| 9000      | avax  | Avalanche           | bech32                                                             |
| 9004      | strk  | StarkNet            | keccak256-checksumed-hex                                           |
| 16754     | ardr  | Ardor               | custom                                                             |
| 19167     | flux  | Flux                | base58check P2PKH and P2SH, bech32 (Sprout shielded not supported) |
| 99999     | wicc  | Waykichain          | base58check P2PKH and P2SH                                         |
| 5655640   | vlx   | Velas               | base58, no check                                                   |
| 5718350   | wan   | Wanchain            | checksummed-hex                                                    |
| 5741564   | waves | Waves               | base58                                                             |