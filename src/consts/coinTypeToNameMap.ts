export const evmCoinTypeToNameMap = Object.freeze({
  /* Chain ID: 0 */
  '2147483648': ['default', 'Default'],
  /* Chain ID: 10 */
  '2147483658': ['op', 'Optimism'],
  /* Chain ID: 25 */
  '2147483673': ['cro', 'Cronos'],
  /* Chain ID: 56 */
  '2147483704': ['bsc', 'BNB Smart Chain'],
  /* Chain ID: 60 */
  '2147483708': ['go', 'GoChain'],
  /* Chain ID: 61 */
  '2147483709': ['etc', 'Ethereum Classic'],
  /* Chain ID: 88 */
  '2147483736': ['tomo', 'TomoChain'],
  /* Chain ID: 100 */
  '2147483748': ['gno', 'Gnosis'],
  /* Chain ID: 108 */
  '2147483756': ['tt', 'ThunderCore'],
  /* Chain ID: 130 */
  '2147483778': ['unichain', 'Unichain'],
  /* Chain ID: 137 */
  '2147483785': ['matic', 'Polygon'],
  /* Chain ID: 143 */
  '2147483791': ['monad', 'Monad'],
  /* Chain ID: 146 */
  '2147483794': ['sonic', 'Sonic'],
  /* Chain ID: 169 */
  '2147483817': ['manta', 'Manta Pacific'],
  /* Chain ID: 246 */
  '2147483894': ['ewt', 'Energy Web'],
  /* Chain ID: 250 */
  '2147483898': ['ftm', 'Fantom Opera'],
  /* Chain ID: 288 */
  '2147483936': ['boba', 'Boba'],
  /* Chain ID: 324 */
  '2147483972': ['zksync', 'zkSync'],
  /* Chain ID: 361 */
  '2147484009': ['theta', 'Theta'],
  /* Chain ID: 480 */
  '2147484128': ['worldchain', 'World Chain'],
  /* Chain ID: 820 */
  '2147484468': ['clo', 'Callisto'],
  /* Chain ID: 999 */
  '2147484647': ['hyperevm', 'HyperEVM'],
  /* Chain ID: 1088 */
  '2147484736': ['metis', 'Metis'],
  /* Chain ID: 1135 */
  '2147484783': ['lisk', 'Lisk'],
  /* Chain ID: 1868 */
  '2147485516': ['soneium', 'Soneium'],
  /* Chain ID: 2020 */
  '2147485668': ['ronin', 'Ronin'],
  /* Chain ID: 2741 */
  '2147486389': ['abstract', 'Abstract'],
  /* Chain ID: 4217 */
  '2147487865': ['tempo', 'Tempo'],
  /* Chain ID: 4663 */
  '2147488311': ['robinhood', 'Robinhood Chain'],
  /* Chain ID: 5000 */
  '2147488648': ['mantle', 'Mantle'],
  /* Chain ID: 5042 */
  '2147488690': ['arc', 'Arc'],
  /* Chain ID: 8453 */
  '2147492101': ['base', 'Base'],
  /* Chain ID: 9745 */
  '2147493393': ['plasma', 'Plasma'],
  /* Chain ID: 39797 */
  '2147523445': ['nrg', 'Energi'],
  /* Chain ID: 42161 */
  '2147525809': ['arb1', 'Arbitrum One'],
  /* Chain ID: 42170 */
  '2147525818': ['arbnova', 'Arbitrum Nova'],
  /* Chain ID: 42220 */
  '2147525868': ['celo', 'Celo'],
  /* Chain ID: 43114 */
  '2147526762': ['avaxc', 'Avalanche C-Chain'],
  /* Chain ID: 57073 */
  '2147540721': ['ink', 'Ink'],
  /* Chain ID: 59144 */
  '2147542792': ['linea', 'Linea'],
  /* Chain ID: 80094 */
  '2147563742': ['berachain', 'Berachain'],
  /* Chain ID: 167000 */
  '2147650648': ['taiko', 'Taiko'],
  /* Chain ID: 534352 */
  '2148018000': ['scr', 'Scroll'],
  /* Chain ID: 7777777 */
  '2155261425': ['zora', 'Zora'],
} as const)

export const nonEvmCoinTypeToNameMap = Object.freeze({
  '0': ['btc', 'Bitcoin'],
  '2': ['ltc', 'Litecoin'],
  '3': ['doge', 'Dogecoin'],
  '4': ['rdd', 'Reddcoin'],
  '5': ['dash', 'Dash'],
  '6': ['ppc', 'Peercoin'],
  '7': ['nmc', 'Namecoin'],
  '14': ['via', 'Viacoin'],
  '20': ['dgb', 'DigiByte'],
  '22': ['mona', 'Monacoin'],
  '42': ['dcr', 'Decred'],
  '43': ['xem', 'NEM'],
  '57': ['sys', 'Syscoin'],
  '60': ['eth', 'Ethereum'],
  '61': ['etcLegacy', '[LEGACY] Ethereum Classic'],
  '74': ['icx', 'ICON'],
  '77': ['xvg', 'Verge'],
  '111': ['ark', 'ARK'],
  '118': ['atom', 'Atom'],
  '121': ['zen', 'Zencash'],
  '128': ['xmr', 'Monero'],
  '133': ['zec', 'Zcash'],
  '135': ['steem', 'Steem'],
  '136': ['firo', 'Firo'],
  '137': ['rbtc', 'RSK'],
  '141': ['kmd', 'Komodo'],
  '144': ['xrp', 'Ripple'],
  '145': ['bch', 'Bitcoin Cash'],
  '148': ['xlm', 'Stellar Lumens'],
  '153': ['btm', 'Bytom'],
  '156': ['btg', 'Bitcoin Gold'],
  '165': ['nano', 'Nano'],
  '175': ['rvn', 'Ravencoin'],
  '192': ['lcc', 'LitecoinCash'],
  '195': ['trx', 'Tron'],
  '235': ['fio', 'FIO'],
  '236': ['bsv', 'BitcoinSV'],
  '242': ['nim', 'Nimiq'],
  '246': ['ewtLegacy', '[LEGACY] Energy Web'],
  '283': ['algo', 'Algorand'],
  '291': ['iost', 'IOST'],
  '301': ['divi', 'Divi Project'],
  '304': ['iotx', 'IoTeX'],
  '308': ['bts', 'Bitshares'],
  '309': ['ckb', 'Nervos CKB'],
  '313': ['zil', 'Zilliqa'],
  '326': ['mrx', 'Metrix Coin'],
  '354': ['dot', 'Polkadot'],
  '360': ['vsys', 'V Systems'],
  '397': ['near', 'NEAR Protocol'],
  '425': ['aion', 'Aion'],
  '434': ['ksm', 'Kusama'],
  '457': ['ae', 'æternity'],
  '459': ['kava', 'Kava'],
  '461': ['fil', 'Filecoin'],
  '472': ['ar', 'Arweave'],
  '500': ['thetaLegacy', '[LEGACY] Theta'],
  '501': ['sol', 'Solana'],
  '508': ['egld', 'MultiversX'],
  '539': ['flow', 'Flow'],
  '566': ['iris', 'Irisnet'],
  '570': ['bdx', 'Beldex'],
  '574': ['vlxLegacy', '[LEGACY] Velas'],
  '589': ['tfuel', 'Theta Fuel'],
  '592': ['grin', 'Grin'],
  '700': ['gnoLegacy', '[LEGACY] Gnosis'],
  '784': ['sui', 'Sui'],
  '818': ['vet', 'VeChain'],
  '820': ['cloLegacy', '[LEGACY] Callisto'],
  '825': ['hive', 'Hive'],
  '888': ['neo', 'NEO'],
  '889': ['tomoLegacy', '[LEGACY] TomoChain'],
  '913': ['vara', 'Vara Network'],
  '931': ['rune', 'THORChain'],
  '1001': ['ttLegacy', '[LEGACY] ThunderCore'],
  '1007': ['ftmLegacy', '[LEGACY] Fantom'],
  '1023': ['one', 'HARMONY-ONE'],
  '1024': ['ont', 'Ontology'],
  '1237': ['nostr', 'Nostr'],
  '1729': ['xtz', 'Tezos'],
  '1815': ['ada', 'Cardano'],
  '1991': ['sc', 'Sia'],
  '2301': ['qtum', 'QTUM'],
  '2303': ['gxc', 'GXChain'],
  '2305': ['ela', 'Elastos'],
  '2718': ['nas', 'Nebulas'],
  '3030': ['hbar', 'Hedera HBAR'],
  '4218': ['iota', 'IOTA'],
  '5353': ['hns', 'Handshake'],
  '5757': ['stx', 'Stacks'],
  '6060': ['goLegacy', '[LEGACY] GoChain'],
  '8444': ['xch', 'Chia'],
  '8964': ['nuls', 'NULS'],
  '9000': ['avax', 'Avalanche'],
  '9004': ['strk', 'StarkNet'],
  '9797': ['nrgLegacy', '[LEGACY] Energi'],
  '16754': ['ardr', 'Ardor'],
  '19167': ['flux', 'Flux'],
  '52752': ['celoLegacy', '[LEGACY] Celo'],
  '5655640': ['vlx', 'Velas'],
  '5718350': ['wan', 'Wanchain'],
  '5741564': ['waves', 'Waves'],
} as const)

export const coinTypeToNameMap = Object.freeze({
  ...nonEvmCoinTypeToNameMap,
  ...evmCoinTypeToNameMap,
} as const)
