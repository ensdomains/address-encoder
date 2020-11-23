import fs from 'fs';
import { IFormat, formats, formatsByName, formatsByCoinType } from '../index';

interface TestVector {
  name: string;
  coinType: number;
  passingVectors: Array<{ text: string; hex: string; canonical?: string }>;
}

// Ordered by coinType
const vectors: Array<TestVector> = [
  {
    name: 'BTC',
    coinType: 0,
    passingVectors: [
      { text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', hex: '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac' },
      { text: '3Ai1JZ8pdJb2ksieUV8FsxSNVJCpoPi8W6', hex: 'a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1887' },
      { text: 'bc1qw508d6qejxtdg4y5r3zarvary0c5xw7kv8f3t4', hex: '0014751e76e8199196d454941c45d1b3a323f1433bd6' },
      {
        text: 'bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx',
        hex: '5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6',
      },
      { text: 'bc1sw50qa3jx3s', hex: '6002751e' },
      { text: 'bc1zw508d6qejxtdg4y5r3zarvaryvg6kdaj', hex: '5210751e76e8199196d454941c45d1b3a323' },
      {
        text: 'bc1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qccfmv3',
        hex: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262',
      },
    ],
  },
  {
    name: 'LTC',
    coinType: 2,
    passingVectors: [
      { text: 'LaMT348PWRnrqeeWArpwQPbuanpXDZGEUz', hex: '76a914a5f4d12ce3685781b227c1f39548ddef429e978388ac' },
      { text: 'MQMcJhpWHYVeQArcZR3sBgyPZxxRtnH441', hex: 'a914b48297bff5dadecc5f36145cec6a5f20d57c8f9b87' },
      { text: 'ltc1qdp7p2rpx4a2f80h7a4crvppczgg4egmv5c78w8', hex: '0014687c150c26af5493befeed7036043812115ca36c' },
    ],
  },
  {
    name: 'DOGE',
    coinType: 3,
    passingVectors: [
      { text: 'DBXu2kgc3xtvCUWFcxFE3r9hEYgmuaaCyD', hex: '76a9144620b70031f0e9437e374a2100934fba4911046088ac' },
      { text: 'AF8ekvSf6eiSBRspJjnfzK6d1EM6pnPq3G', hex: 'a914f8f5d99a9fc21aa676e74d15e7b8134557615bda87' },
    ],
  },
  {
    name: 'RDD',
    coinType: 4,
    passingVectors: [
      { text: 'RkQDYcqiv7mzQfNYMc8FfYv3dtQ8wuSGoM', hex: '76a914814089fb909f05918d54e530f0ad8e339a4edffe88ac' },
      { text: '3QJmV3qfvL9SuYo34YihAf3sRCW3qSinyC', hex: 'a914f815b036d9bbbce5e9f2a00abd1bf3dc91e9551087' },
    ],
  },
  {
    name: 'DASH',
    coinType: 5,
    passingVectors: [
      { text: 'XtAG1982HcYJVibHxRZrBmdzL5YTzj4cA1', hex: '76a914bfa98bb8a919330c432e4ff16563c5ab449604ad88ac' },
      { text: '7gks9gWVmGeir7m4MhsSxMzXC2eXXAuuRD', hex: 'a9149d646d71f0815c0cfd8cd08aa9d391cd127f378687' },
    ],
  },
  {
    name: 'PPC',
    coinType: 6,
    passingVectors: [
      { text: 'PRL8bojUujzDGA6HRapzprXWFxMyhpS7Za', hex: '76a914b7a1c4349e794ee3484b8f433a7063eb614dfdc788ac' },
    ],
  },
  {
    name: 'NMC',
    coinType: 7,
    passingVectors: [
      { text: 'TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh', hex: '41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1' },
      { text: 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW', hex: '415a523b449890854c8fc460ab602df9f31fe4293f' },
    ],
  },
  {
    name: 'MONA',
    coinType: 22,
    passingVectors: [
      { text: 'MHxgS2XMXjeJ4if2PRRbWYcdwZPWfdwaDT', hex: '76a9146e5bb7226a337fe8307b4192ae5c3fab9fa9edf588ac' },
      { text: 'PHjTKtgYLTJ9D2Bzw2f6xBB41KBm2HeGfg', hex: 'a9146449f568c9cd2378138f2636e1567112a184a9e887' },
      { text: 'mona1zw508d6qejxtdg4y5r3zarvaryvhm3vz7', hex: '5210751e76e8199196d454941c45d1b3a323' },
    ],
  },
  {
    name: 'DCR',
    coinType: 42,
    passingVectors: [
      { text: 'DsnBFk2BdqYP3WEmChpL7TSonhpxUAi8wiA', hex: '073fe8b089c48ba23c60c64c5226d47acfb26565e313934d5d73'},
    ],
  },
  {
    name: 'XEM',
    coinType: 43,
    passingVectors: [
      { text: 'NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6', hex: '681f142c5ea4853063ed6dc3c13aaa8257cd7daf1109132a5e' },
      { text: 'NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY', hex: '6818e054e5abd3e2bf7ac3f46133dcb4a2c55c1d52b16b1df8' },
    ],
  },
  {
    name: 'AIB',
    coinType: 55,
    passingVectors: [
      { text: 'AJc4bPnvyvdUhFqaGLB8hhiAPyJdcZvs4Z', hex: '76a9141f0d5afac97c916cdaccc0dd1c41cb03fde8452f88ac' },
    ],
  },
  {
    name: 'SYS',
    coinType: 57,
    passingVectors: [
      { text: 'SVoQzrfQpoiYsrHMXvwbgeJZooqw8zPF9Q', hex: '76a9145d5113254a2fb792d209b2731b7c05ee9441aa9088ac' },
      { text: 'SdQRVkLTiYCA75o4hE4TMjMCJL8CytF31G', hex: '76a914b0b8ee03d302db1bd6ef689a73de764e3157909588ac' },
      { text: 'sys1q42jdpqq4369ze73rskkrncplcv7mtejhdkxj90', hex: '0014aaa4d080158e8a2cfa2385ac39e03fc33db5e657' },
      { text: 'sys1qlfz9tcds52ajh25v2a85ur22rt2mm488twvs5l', hex: '0014fa4455e1b0a2bb2baa8c574f4e0d4a1ad5bdd4e7' },
    ],
  },
  {
    name: 'ETH',
    coinType: 60,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'ETC',
    coinType: 61,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'ICX',
    coinType: 74,
    passingVectors: [
      { text: 'hx6b38701ddc411e6f4e84a04f6abade7661a207e2', hex: '006b38701ddc411e6f4e84a04f6abade7661a207e2' },
      { text: 'cxa4524257b3511fb9574009785c1f1e73cf4097e7', hex: '01a4524257b3511fb9574009785c1f1e73cf4097e7' },
    ],
  },
  {
    name: 'ARK',
    coinType: 111,
    passingVectors: [
      { text: 'AKkCgA5To85YSAgJgxUw8dKJsHkCzsu2dy', hex: '172b8f8e3490db00c6cc0dda2d2b9626e681500e29' }
    ],
  },
  {
    name: 'ATOM',
    coinType: 118,
    passingVectors: [
      { text: 'cosmos1depk54cuajgkzea6zpgkq36tnjwdzv4afc3d27', hex: '6e436a571cec916167ba105160474b9c9cd132bd' },
    ],
  },
  {
    name: 'ZIL',
    coinType: 119,
    passingVectors: [
      { text: 'zil139tkqvc8rw92e6jrs40gawwc3mmdmmauv3x3yz', hex: '89576033071b8aacea43855e8eb9d88ef6ddefbc' },
    ],
  },
  {
    name: 'EGLD',
    coinType: 120,
    passingVectors: [
      {
        text: 'erd1qdzvfpa7gqjsnfhdxhvcp2mlysc80uz60yjhxre3lwl00q0jd4nqgauy9q',
        hex: '0344c487be402509a6ed35d980ab7f243077f05a7925730f31fbbef781f26d66',
      },
    ],
  },
  {
    name: 'ZEC',
    coinType: 133,
    passingVectors: [
      {
        // P2PKH Transparent Address
        text: 't1b2ArRwLq6KbdJFzJVYPxgUVT1d9QuBzTf',
        hex: '76a914bc18e286d40706de62928155d6167bf30719857888ac'
      },
      {
        // P2SH Transparent Address
        text: 't3Vz22vK5z2LcKEdg16Yv4FFneEL1zg9ojd',
        hex: 'a9147d46a730d31f97b1930d3368a967c309bd4d136a87'
      },
      {
        // Sapling Payment Address (shielded address)
        text: 'zs1wkejr23wqa9ptpvv73ch3wr96lh8gnyx3689skmyttljy4nyfj69eyclukwkxrhr3rrkgxvnur0',
        hex: '75b321aa2e074a15858cf47178b865d7ee744c868e8e585b645aff2256644cb45c931fe59d630ee388c764'
      }
    ],
  },
  {
    name: 'LSK',
    coinType: 134,
    passingVectors: [
      { text: '5506432865724830000L', hex: '4c6ac7845d109130' },
      { text: '10588416556841527004L', hex: '92f19cc2346766dc' },
      { text: '4980451641598555896L', hex: '451e1e61667e36f8' },
    ],
  },
  {
    name: 'STEEM',
    coinType: 135,
    passingVectors: [
      { text: 'STM8QykigLRi9ZUcNy1iXGY3KjRuCiLM8Ga49LHti1F8hgawKFc3K', hex: '03d0519ddad62bd2a833bee5dc04011c08f77f66338c38d99c685dee1f454cd1b8' },
    ],
  },
  {
    name: 'RSK',
    coinType: 137,
    passingVectors: [
      { text: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD', hex: '5aaeb6053f3e94c9b9a09f33669435e7ef1beaed' },
      {
        text: '0x5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
        hex: '5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
        canonical: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
      },
      {
        text: '0x5AAEB6053F3E94C9B9A09F33669435E7EF1BEAED',
        hex: '5aaeb6053f3e94c9b9a09f33669435e7ef1beaed',
        canonical: '0x5aaEB6053f3e94c9b9a09f33669435E7ef1bEAeD',
      },
    ],
  },
  {
    name: 'XRP',
    coinType: 144,
    passingVectors: [
      { text: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn', hex: '004b4e9c06f24296074f7bc48f92a97916c6dc5ea9' },
      {
        text: 'X7qvLs7gSnNoKvZzNWUT2e8st17QPY64PPe7zriLNuJszeg',
        hex: '05444b4e9c06f24296074f7bc48f92a97916c6dc5ea9000000000000000000',
      },
    ],
  },
  {
    name: 'BCH',
    coinType: 145,
    passingVectors: [
      {
        text: '1BpEi6DfDAUFd7GtittLSdBeYJvcoaVggu',
        hex: '76a91476a04053bda0a88bda5177b86a15c3b29f55987388ac',
        canonical: 'bitcoincash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a',
      },
      {
        text: '1KXrWXciRDZUpQwQmuM1DbwsKDLYAYsVLR',
        hex: '76a914cb481232299cd5743151ac4b2d63ae198e7bb0a988ac',
        canonical: 'bitcoincash:qr95sy3j9xwd2ap32xkykttr4cvcu7as4y0qverfuy',
      },
      {
        text: '16w1D5WRVKJuZUsSRzdLp9w3YGcgoxDXb',
        hex: '76a914011f28e473c95f4013d7d53ec5fbc3b42df8ed1088ac',
        canonical: 'bitcoincash:qqq3728yw0y47sqn6l2na30mcw6zm78dzqre909m2r',
      },
      {
        text: '3CWFddi6m4ndiGyKqzYvsFYagqDLPVMTzC',
        hex: 'a91476a04053bda0a88bda5177b86a15c3b29f55987387',
        canonical: 'bitcoincash:ppm2qsznhks23z7629mms6s4cwef74vcwvn0h829pq',
      },
      {
        text: '3LDsS579y7sruadqu11beEJoTjdFiFCdX4',
        hex: 'a914cb481232299cd5743151ac4b2d63ae198e7bb0a987',
        canonical: 'bitcoincash:pr95sy3j9xwd2ap32xkykttr4cvcu7as4yc93ky28e',
      },
      {
        text: '31nwvkZwyPdgzjBJZXfDmSWsC4ZLKpYyUw',
        hex: 'a914011f28e473c95f4013d7d53ec5fbc3b42df8ed1087',
        canonical: 'bitcoincash:pqq3728yw0y47sqn6l2na30mcw6zm78dzq5ucqzc37',
      },
    ],
  },
  {
    name: 'XLM',
    coinType: 148,
    passingVectors: [
      {
        text: 'GAI3GJ2Q3B35AOZJ36C4ANE3HSS4NK7WI6DNO4ZSHRAX6NG7BMX6VJER',
        hex: '11b32750d877d03b29df85c0349b3ca5c6abf64786d773323c417f34df0b2fea',
      },
    ],
  },
  {
    name: 'NANO',
    coinType: 165,
    passingVectors: [
      { 
        text: 'nano_15dng9kx49xfumkm4q6qpaxneie6oynebiwpums3ktdd6t3f3dhp69nxgb38', 
        hex: '0d7471e5d11faddce5315c97b23b464184afa8c4c396dcf219696b2682d0adf6' 
      },
      {
        text: 'nano_1anrzcuwe64rwxzcco8dkhpyxpi8kd7zsjc1oeimpc3ppca4mrjtwnqposrs',
        hex: '2298fab7c61058e77ea554cb93edeeda0692cbfcc540ab213b2836b29029e23a'
      },
    ],
  },
  {
    name: 'RVN',
    coinType: 175,
    passingVectors: [
      { text: 'RJYZeWxr1Ly8YgcvJU1qD5MR9jUtk14HkN', hex: '76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac' }, // p2pk
      { text: 'rGtwTfEisPQ7k8KNggmT4kq2vHpbEV6evU', hex: 'a91474f209f6ea907e2ea48f74fae05782ae8a66525787' }, // p2sh
    ],
  },
  {
    name: 'EOS',
    coinType: 194,
    passingVectors: [
      {
        text: 'EOS7pyZLEjxhkSBYnPJf585vcZrqdQoA4KsRHDej6i3vsnV7aseh9',
        hex: '03831c26f94b3af1a5f73ec3b961bc617b35bd99afe74bc1fe2c15d6d09bd4a416',
      },
      {
        text: 'EOS51imoRdUT7THtgrrVxPfYwRk3V5jVmrj18D7hbk1FQFexNmCv1',
        hex: '02106b727b87e01b0a298253655e7b0848ce3f4ec152ae6574643c0400ec3d1816',
      },
    ],
  },
  {
    name: 'TRX',
    coinType: 195,
    passingVectors: [
      { text: 'TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh', hex: '41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1' },
      { text: 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW', hex: '415a523b449890854c8fc460ab602df9f31fe4293f' },
    ],
  },
  {
    name: 'NEO',
    coinType: 239,
    passingVectors: [{ text: 'AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF', hex: '17ad5cac596a1ef6c18ac1746dfd304f93964354b5' }],
  },
  // Disabled for now as it was not working on the browser
  // {
  //   name: 'ALGO',
  //   coinType: 283,
  //   passingVectors: [
  //     {
  //       text: '7777777777777777777777777777777777777777777777777774MSJUVU',
  //       hex: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  //     },
  //     {
  //       text: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
  //       hex: '0000000000000000000000000000000000000000000000000000000000000000',
  //     },
  //   ],
  // },
  {
  name: 'DIVI',
    coinType: 301,
    passingVectors: [
      { text: 'D8gBQyHPm7A673utQQwBaQcX2Kz91wJovR', hex: '76a91426c95750c1afe443b3351ea5923d5bae09c2a74b88ac' },
      { text: 'DSQvV5yKP5m2tR6uShpt8zmeM8UavPhwfH', hex: '76a914e958e753703fa13eb63b39a92d1f17f06abead5e88ac' },
    ],
  },
  {
    name: 'IOTX',
    coinType: 304,
    passingVectors: [
      { text: 'io1nyjs526mnqcsx4twa7nptkg08eclsw5c2dywp4', hex: '99250a2b5b983103556eefa615d90f3e71f83a98'},
    ],
  },
  {
    name: 'DOT',
    coinType: 354,
    passingVectors: [
      {
        text: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg',
        hex: '0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b',
      },
    ],
  },
  {
    name: 'KSM',
    coinType: 434,
    passingVectors: [
      {
        text: 'CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp',
        hex: '0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b',
      },
      {
        text: 'DDioZ6gLeKMc5xUCeSXRHZ5U43MH1Tsrmh8T3Gcg9Vxr6DY',
        hex: '1c86776eda34405584e710a7363650afd1f2b38ef72836317b11ef1303a0ae72',
      },
      {
        text: 'EDNfVHuNHrXsVTLMMNbp6Con5zESZJa3fkRc93AgahuMm99',
        hex: '487ee7e677203b4209af2ffaec0f5068033c870c97fee18b31b4aee524089943',
      },
    ],
  },
  {
    name: 'FIL',
    coinType: 461,
    passingVectors: [
      { // Protocol 0: ID
        // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L15
        text: 'f0150',
        // Buffer.from(Uint8Array.of(0, 150, 1)).toString('hex')
        hex: '009601',
      },
      { // Protocol 1: Secp256k1 Addresses
        // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L50
        text: 'f15ihq5ibzwki2b4ep2f46avlkrqzhpqgtga7pdrq',
        // Buffer.from(Uint8Array.of(1,234,15,14,160,57,178,145,160,240,143,209,121,224,85,106,140,50,119,192,211)).toString('hex')
        hex: '01ea0f0ea039b291a0f08fd179e0556a8c3277c0d3',
      },
      { // Protocol 2: Actor address
        // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L183
        text: 'f24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i',
        // Buffer.from(Uint8Array.of(2,229,77,234,79,155,197,180,125,38,24,25,130,109,94,31,191,139,197,80,59)).toString('hex')
        hex: '02e54dea4f9bc5b47d261819826d5e1fbf8bc5503b'
      },
      { // Protocol 3: BLSAddresses
        // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L183
        text: 'f3vvmn62lofvhjd2ugzca6sof2j2ubwok6cj4xxbfzz4yuxfkgobpihhd2thlanmsh3w2ptld2gqkn2jvlss4a',
        // Buffer.from(Uint8Array.of(3,173,88,223,105,110,45,78,145,234,134,200,129,233,56,186,78,168,27,57,94,18,121,123,132,185,207,49,75,149,70,112,94,131,156,122,153,214,6,178,71,221,180,249,172,122,52,20,221)).toString('hex')
        hex: '03ad58df696e2d4e91ea86c881e938ba4ea81b395e12797b84b9cf314b9546705e839c7a99d606b247ddb4f9ac7a3414dd'
      }
    ],
  },
  {
    name: 'CCA',
    coinType: 489,
    passingVectors: [
      { text: '5jZrpsZVkNhDKEuNcYZ1kk2wNWJRbaKy22', hex: '76a914c3c95e1effb0f6ebde0ac0751d6bfd69ad98511c88ac' },
      { text: '5mi7oAoMVL7cVJhXsmWxnTDxTUiBUkR996', hex: '76a914db49719be13e8221f6d568a01f9d14adc4f887ff88ac' },
    ],
  },
  {
    name: 'SOL',
    coinType: 501,
    passingVectors: [
      // The address reportetd by Trust Wallet team that it is having problem.
      { text: 'AHy6YZA8BsHgQfVkk7MbwpAN94iyN7Nf1zN4nPqUN32Q', hex: '8a11e71b96cabbe3216e3153b09694f39fc85022cbc076f79846a3ab4d8c1991' },
      // https://github.com/trustwallet/wallet-core/blob/8d3100f61e36d1e928ed1dea60ff7554bba0db16/tests/Solana/AddressTests.cpp#L26
      { text: '2gVkYWexTHR5Hb2aLeQN3tnngvWzisFKXDUPrgMHpdST', hex: '18f9d8d877393bbbe8d697a8a2e52879cc7e84f467656d1cce6bab5a8d2637ec'},
      // https://explorer.solana.com/address/CNR8RPMxjY28VsPA6KFq3B8PUdZnrTSC5HSFwKPBR29Z
      { text: 'CNR8RPMxjY28VsPA6KFq3B8PUdZnrTSC5HSFwKPBR29Z', hex: 'a8ed08e3e8fe204de45e7295cc1ad53db096621b878f8c546e5c09f5e48f70b4' },
      // The old test case (same as TRON and NMC), only keep it for reference purpose.
      { text: 'TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh', hex: '41cf1ecacaf90a04bb0297f9991ae1262d0a3399e13d6d96c2' }
    ],
  },
  {
    name: 'IRIS',
    coinType: 566,
    passingVectors: [
      { text: 'iaa1k5y45px87c42ttxgk8x4y6w0y9gzgcwvvunht5', hex: 'b5095a04c7f62aa5acc8b1cd5269cf21502461cc' },
    ],
  },
  {
    name: 'LRG',
    coinType: 568,
    passingVectors: [
      { text: 'DM8Zwin2rJczpjy2TXY5UZbZQLkUhYBH61', hex: '76a914af687904a4e15a2f1cac37dfb6cbceb9dba8afb788ac' },
      { text: '6bNNutYQz11WrkVCrj1nUS1dBGyoVZjdEg', hex: 'a914e613c7be9b53e1a47fd4edb3ea9777cf29dce30f87' },
    ],
  },
  {
    name: 'CCXX',
    coinType: 571,
    passingVectors: [
      { text: 'XVVxhJAGNXP32xAcfCm1mVDLs5dCeodLjL', hex: 'a914c7188637dfd328e6911d63da67cdbea52507dd3087' },
      { text: 'XKcgJ1jyjwbGCE7wT6GRMKZGjFrkNs2sLb', hex: 'a9145aac7ca95006faf9244907af1e2b873a6a58e1af87' },
    ],
  },
  {
    name: 'BPS',
    coinType: 576,
    passingVectors: [
      { text: '1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i', hex: '76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac' },
      { text: '3CMNFxN1oHBc4R1EpboAL5yzHGgE611Xou', hex: 'a91474f209f6ea907e2ea48f74fae05782ae8a66525787' },
    ],
  },
  {
    name: 'XDAI',
    coinType: 700,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'VET',
    coinType: 703,
    passingVectors: [
      { text: '0x9760b32C0A515F6C8c4E6B7B89AF8964DDaCB985', hex: '9760b32c0a515f6c8c4e6b7b89af8964ddacb985' },
    ],
  },
  {
    name: 'BNB',
    coinType: 714,
    passingVectors: [
      { text: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2', hex: '40c2979694bbc961023d1d27be6fc4d21a9febe6' },
    ],
  },
  {
    name: 'HIVE',
    coinType: 825,
    passingVectors: [
      { text: 'STM8QykigLRi9ZUcNy1iXGY3KjRuCiLM8Ga49LHti1F8hgawKFc3K', hex: '03d0519ddad62bd2a833bee5dc04011c08f77f66338c38d99c685dee1f454cd1b8' },
    ],
  },
  {
    name: 'ONE',
    coinType: 1023,
    passingVectors: [
      { text: 'one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7', hex: '7c41e0668b551f4f902cfaec05b5bdca68b124ce' },
    ],
  },
  {
    name: 'ONT',
    coinType: 1024,
    passingVectors: [
      { text: 'ALvmTSEjNREwcRNJiLcTkxCnsXBfbZEUFK', hex: '3887346ea0b83129ff21f1ef3e6008a80373d1b3' },
      { text: 'AavjHwiNfkr7xKGHBpNEQYSL5QiKgRjZf1', hex: 'd21728df85b2b457908bd33def8ff493d47f184a' },
      { text: 'AGmV3oHqzfAs3VFiqmn6cecxCXVNyg6tNh', hex: '0ae542fee226c044dc19b036db7cec939777596f' },
    ],
  },
  {
    name: 'XTZ',
    coinType: 1729,
    passingVectors: [
      { text: 'KT1BDEn6wobs7tDReKkGheXAhoq278TGaNn5', hex: '011cd5f135e80fd8ebb6e43335b24ca6116edeba6900' },
      { text: 'KT1BDEn6wobs7tDReKkGheXAhoq278TGaNn5', hex: '011cd5f135e80fd8ebb6e43335b24ca6116edeba6900' },

      { text: 'tz1XdRrrqrMfsFKA8iuw53xHzug9ipr6MuHq', hex: '000083846eddd5d3c5ed96e962506253958649c84a74' },
      { text: 'tz2Cfwk4ortcaqAGcVJKSxLiAdcFxXBLBoyY', hex: '00012fcb1d9307f0b1f94c048ff586c09f46614c7e90' },
      { text: 'tz3NdTPb3Ax2rVW2Kq9QEdzfYFkRwhrQRPhX', hex: '0002193b2b3f6b8f8e1e6b39b4d442fc2b432f6427a8' },
    ],
  },
  {
    name: 'ADA',
    coinType: 1815,
    passingVectors: [
      {
        text: 'addr1gqtnpvdhqrtpd4g424fcaq7k0ufuzyadt7djygf8qdyzevuph3wczvf2dwyx5u',
        hex: '401730b1b700d616d51555538e83d67f13c113ad5f9b22212703482cb381bc5d81312a',
      },
    ],
  },
  {
    name: 'QTUM',
    coinType: 2301,
    passingVectors: [
      { text: 'Qc6iYCZWn4BauKXGYirRG8pMtgdHMk2dzn', hex: '3aa9f8f3b055324f6b2d6bcac328ec2d7e3cd22d8b' },
    ]
  },
  {
    name: 'ELA',
    coinType: 2305,
    passingVectors: [
      { text: 'EQDZ4T6YyVkg9mb2cAuLEu8iBKbajQAywF', hex: '214d797cc92303dac242b17026e79bbea28eb642f29f0d3582' }
    ],
  },
  {
    name: 'HBAR',
    coinType: 3030,
    passingVectors: [
      {
        text: '255.255.1024',
        hex: '000000ff00000000000000ff0000000000000400',
      },
      {
        text: `${BigInt(2 ** 32) - BigInt(1)}.${BigInt(2 ** 64) - BigInt(1)}.${BigInt(2 ** 64) - BigInt(1)}`,
        hex: 'ffffffffffffffffffffffffffffffffffffffff',
      },
    ],
  },
  {
    name: 'HNS',
    coinType: 5353,
    passingVectors: [
      { text: 'hs1qd42hrldu5yqee58se4uj6xctm7nk28r70e84vx', hex: '6d5571fdbca1019cd0f0cd792d1b0bdfa7651c7e' },
    ],
  },
  {
    name: 'NRG',
    coinType: 9797,
    passingVectors: [
      { text: '0x7e534bc64A80e56dB3eEDBd1b54639C3A9a7CDEA', hex: '7e534bc64a80e56db3eedbd1b54639c3a9a7cdea' },
    ],
  },
  {
    name: 'CELO',
    coinType: 52752,
    passingVectors: [
      { text: '0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275', hex: '67316300f17f063085ca8bca4bd3f7a5a3c66275' },
    ],
  },
];

var lastCointype = -1;
vectors.forEach((vector: TestVector) => {
  test(vector.name, () => {
    // Test vectors must be in order
    expect(vector.coinType).toBeGreaterThan(lastCointype);
    lastCointype = vector.coinType;

    const format = formatsByName[vector.name];
    expect(formatsByCoinType[vector.coinType]).toBe(format);

    for (var example of vector.passingVectors) {
      const decoded = format.decoder(example.text);
      expect(decoded).toBeInstanceOf(Buffer);
      expect(decoded.toString('hex')).toBe(example.hex);
      const reencoded = format.encoder(decoded);
      expect(reencoded).toBe(example.canonical || example.text);
      if (example.canonical !== undefined) {
        // Check we didn't lose anything
        expect(format.decoder(reencoded).toString('hex')).toBe(example.hex);
      }
    }
  });
});

test("Format ordering", () => {
  lastCointype = -1;
  formats.forEach((format: IFormat) => {
    // Formats must be in order
    expect(format.coinType).toBeGreaterThan(lastCointype);
    lastCointype = format.coinType;
  });
});

test("README ordering", () => {
  const lines = fs.readFileSync('README.md', {encoding: 'utf-8'}).split('\n');
  const sectionIdx = lines.indexOf("## Supported cryptocurrencies");
  var entries = [];
  for(var i = sectionIdx + 1; i < lines.length; i++) {
    if(lines[i].startsWith(' - ')) {
      entries.push(lines[i].substr(3));
    } else if(lines[i].startsWith('#')) {
      break;
    }
  }

  var sortedEntries = entries.slice(0).sort();
  expect(entries).toEqual(sortedEntries);
});
