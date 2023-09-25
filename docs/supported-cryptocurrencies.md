## Supported Cryptocurrencies

This library currently supports the following cryptocurrencies and address formats (ordered alphabetically):

| Name     | Encoding Type                                                      |
| -------- | ------------------------------------------------------------------ |
| ABBC     | base58 + ripemd160-checksum                                        |
| ADA      | base58, no check + crc32-checksum and bech32                       |
| AE       | base58check                                                        |
| AIB      | base58check P2PKH and P2SH                                         |
| AION     | hex                                                                |
| ALGO     | checksummed-base32                                                 |
| AR       | base64url                                                          |
| ARB1     | checksummed-hex                                                    |
| ARDR     | custom                                                             |
| ARK      | base58check                                                        |
| ATOM     | bech32                                                             |
| AVAX     | bech32                                                             |
| AVAXC    | checksummed-hex                                                    |
| BCD      | base58check P2PKH and P2SH, and bech32 segwit                      |
| BCH      | base58check and cashAddr; decodes to cashAddr                      |
| BCN      | base58xmr                                                          |
| BDX      | base58xmr                                                          |
| BNB      | bech32                                                             |
| BPS      | base58check P2PKH and P2SH                                         |
| BSC      | checksummed-hex                                                    |
| BSV      | base58check                                                        |
| BTC      | base58check P2PKH and P2SH, and bech32 segwit                      |
| BTG      | base58check P2PKH and P2SH, and bech32 segwit                      |
| BTM      | bech32 segwit                                                      |
| BTS      | base58 + ripemd160-checksum                                        |
| CCA      | base58check P2PKH and P2SH                                         |
| CCXX     | base58check P2PKH and P2SH, and bech32 segwit                      |
| CELO     | checksummed-hex                                                    |
| CKB      | bech32                                                             |
| CLO      | checksummed-hex                                                    |
| CRO      | checksummed-hex                                                    |
| DASH     | base58check P2PKH and P2SH                                         |
| DCR      | base58, no check                                                   |
| DGB      | base58check P2PKH and P2SH, and bech32 segwit                      |
| DIVI     | base58check P2PKH and P2SH                                         |
| DOGE     | base58check P2PKH and P2SH                                         |
| DOT      | ss58                                                               |
| EGLD     | bech32                                                             |
| ELA      | base58                                                             |
| EOS      | base58 + ripemd160-checksum                                        |
| ETC      | checksummed-hex                                                    |
| ETH      | checksummed-hex                                                    |
| ETN      | base58xmr                                                          |
| EWT      | checksummed-hex                                                    |
| FIL      | base10 + leb128 and base32 + blake2b checksum                      |
| FIO      | base58 + ripemd160-checksum                                        |
| FIRO     | base58check P2PKH and P2SH                                         |
| FLOW     | hex                                                                |
| FTM      | checksummed-hex                                                    |
| GNO      | checksummed-hex                                                    |
| GO       | checksummed-hex                                                    |
| GRIN     | base58check                                                        |
| GXC      | base58 + ripemd160-checksum                                        |
| HBAR     | custom                                                             |
| HIVE     | base58 + ripemd160-checksum                                        |
| HNS      | custom                                                             |
| HNT      | base58check                                                        |
| ICX      | custom                                                             |
| IOST     | base58, no check                                                   |
| IOTA     | iotaBech32                                                         |
| IOTX     | bech32                                                             |
| IRIS     | bech32                                                             |
| KAVA     | bech32                                                             |
| KMD      | base58check                                                        |
| KSM      | ss58                                                               |
| LCC      | base58check P2PKH and P2SH, and bech32 segwit                      |
| LRG      | base58check P2PKH and P2SH                                         |
| LSK      | hex with suffix                                                    |
| LTC      | base58check P2PHK and P2SH, and bech32 segwit                      |
| LUNA     | bech32                                                             |
| MATIC    | checksummed-hex                                                    |
| MONA     | base58check P2PKH and P2SH, and bech32 segwit                      |
| MRX      | base58check                                                        |
| NANO     | nano-base32                                                        |
| NAS      | base58 + sha3-256-checksum                                         |
| NEAR     | custom                                                             |
| NEM(XEM) | base32                                                             |
| NEO      | base58check                                                        |
| NMC      | base58check                                                        |
| NRG      | checksummed-hex                                                    |
| NULS     | base58                                                             |
| ONE      | bech32                                                             |
| ONT      | base58check                                                        |
| OP       | checksummed-hex                                                    |
| POA      | checksummed-hex                                                    |
| PPC      | base58check P2PKH and P2SH                                         |
| QTUM     | base58check                                                        |
| RDD      | base58check P2PKH and P2SH                                         |
| RSK      | checksummed-hex                                                    |
| RUNE     | bech32                                                             |
| RVN      | base58check P2PKH and P2SH                                         |
| SC       | blake2b checksum                                                   |
| SERO     | base58, no check                                                   |
| SOL      | base58, no check                                                   |
| SRM      | base58, no check                                                   |
| STEEM    | base58 + ripemd160-checksum                                        |
| STRAT    | base58check P2PKH and P2SH                                         |
| STRK     | keccak256-checksumed-hex                                           |
| STX      | crockford base32 P2PKH and P2SH + ripemd160-checksum               |
| SYS      | base58check P2PKH and P2SH, and bech32 segwit                      |
| TFUEL    | checksummed-hex                                                    |
| THETA    | base58check                                                        |
| TOMO     | checksummed-hex                                                    |
| TRX      | base58check                                                        |
| TT       | checksummed-hex                                                    |
| VET      | checksummed-hex                                                    |
| VIA      | base58check P2PKH and P2SH                                         |
| VLX      | base58, no check                                                   |
| VSYS     | custom                                                             |
| WAN      | checksummed-hex                                                    |
| WAVES    | base58                                                             |
| WICC     | base58check P2PKH and P2SH                                         |
| XCH      | bech32m                                                            |
| XHV      | base58xmr                                                          |
| XLM      | ed25519 public key                                                 |
| XMR      | base58xmr                                                          |
| XRP      | base58check-ripple                                                 |
| Nostr    | bech32                                                             |
| XTZ      | base58check                                                        |
| XVG      | base58check P2PKH and P2SH                                         |
| ZEC      | base58check P2PKH and P2SH, bech32 (Sprout shielded not supported) |
| ZEL      | base58check P2PKH and P2SH, bech32 (Sprout shielded not supported) |
| ZEN      | base58check                                                        |
| ZIL      | bech32                                                             |
