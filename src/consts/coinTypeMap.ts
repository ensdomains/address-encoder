import type { ParseInt } from "../types.js";

export const coinTypeToNameMap = Object.freeze({
  "0": "btc",
  "2": "ltc",
  "3": "doge",
  "4": "rdd",
  "5": "dash",
  "6": "ppc",
  "7": "nmc",
  "14": "via",
  "20": "dgb",
  "22": "mona",
  "42": "dcr",
  "43": "xem",
  "55": "aib",
  "57": "sys",
  "60": "eth",
  "61": "etcLegacy",
  "74": "icx",
  "77": "xvg",
  "105": "strat",
  "111": "ark",
  "118": "atom",
  "119": "zil",
  "120": "egld",
  "121": "zen",
  "128": "xmr",
  "133": "zec",
  "134": "lsk",
  "135": "steem",
  "136": "firo",
  "137": "rsk",
  "141": "kmd",
  "144": "xrp",
  "145": "bch",
  "148": "xlm",
  "153": "btm",
  "156": "btg",
  "165": "nano",
  "175": "rvn",
  "178": "poaLegacy",
  "192": "lcc",
  "194": "eos",
  "195": "trx",
  "204": "bcn",
  "235": "fio",
  "236": "bsv",
  "239": "neo",
  "242": "nim",
  "246": "ewtLegacy",
  "283": "algo",
  "291": "iost",
  "301": "divi",
  "304": "iotx",
  "308": "bts",
  "309": "ckb",
  "326": "mrx",
  "330": "luna",
  "354": "dot",
  "360": "vsys",
  "367": "abbc",
  "397": "near",
  "415": "etn",
  "425": "aion",
  "434": "ksm",
  "457": "ae",
  "459": "kava",
  "461": "fil",
  "472": "ar",
  "489": "cca",
  "500": "thetaLegacy",
  "501": "sol",
  "535": "xhv",
  "539": "flow",
  "566": "iris",
  "568": "lrg",
  "569": "sero",
  "570": "bdx",
  "571": "ccxx",
  "573": "srm",
  "574": "vlx",
  "576": "bps",
  "589": "tfuel",
  "592": "grin",
  "700": "gnoLegacy",
  "703": "vet",
  "714": "bnb",
  "820": "cloLegacy",
  "825": "hive",
  "889": "tomoLegacy",
  "904": "hnt",
  "931": "rune",
  "999": "bcd",
  "1001": "ttLegacy",
  "1007": "ftmLegacy",
  "1023": "one",
  "1024": "ont",
  "1237": "nostr",
  "1729": "xtz",
  "1815": "ada",
  "1991": "sc",
  "2301": "qtum",
  "2303": "gxc",
  "2305": "ela",
  "2718": "nas",
  "3030": "hbar",
  "4218": "iota",
  "5353": "hns",
  "5757": "stx",
  "6060": "goLegacy",
  "8444": "xch",
  "8964": "nuls",
  "9000": "avax",
  "9004": "strk",
  "9797": "nrgLegacy",
  "16754": "ardr",
  "19167": "zel",
  "52752": "celoLegacy",
  "99999": "wicc",
  "5718350": "wan",
  "5741564": "waves",
  // EVM Coin Types
  "2147483658": "op", // Chain ID: 10
  "2147483673": "cro", // Chain ID: 25
  "2147483704": "bsc", // Chain ID: 56
  "2147483708": "go", // Chain ID: 60
  "2147483709": "etc", // Chain ID: 61
  "2147483736": "tomo", // Chain ID: 88
  "2147483747": "poa", // Chain ID: 99
  "2147483748": "gno", // Chain ID: 100
  "2147483756": "tt", // Chain ID: 108
  "2147483785": "matic", // Chain ID: 137
  "2147483894": "ewt", // Chain ID: 246
  "2147483898": "ftm", // Chain ID: 250
  "2147484009": "theta", // Chain ID: 361
  "2147484468": "clo", // Chain ID: 820
  "2147523445": "nrg", // Chain ID: 39797
  "2147525809": "arb1", // Chain ID: 42161
  "2147525868": "celo", // Chain ID: 42220
  "2147526762": "avaxc", // Chain ID: 43114
} as const);

export const coinNameToTypeMap = Object.freeze(
  Object.fromEntries(
    Object.entries(coinTypeToNameMap).map(([k, v]) => [v, parseInt(k)])
  ) as {
    readonly [key in keyof typeof coinTypeToNameMap as (typeof coinTypeToNameMap)[key]]: ParseInt<key>;
  }
);
