import fs from 'fs';
import { IFormat, formats, formatsByName, formatsByCoinType, convertEVMChainIdToCoinType } from '../index';

interface TestVector {
  name: string;
  coinType: number;
  passingVectors: Array<{ text: string; hex: string; canonical?: string; }>;
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
    name: 'VIA',
    coinType: 14,
    passingVectors: [
      { text: 'Vxgc5PCLkzNkDLkuduQEcrUBF1Z1UUHnav', hex: '76a914f8d8b16d9409898a976b66bad157b91b71dc18ca88ac' },
      { text: 'EYg9j8ieF6BQzS9doHnjg3Faj7SdAhfqnV', hex: 'a914aa423f4ab9ea252abc360ec1dada62ef2527245987' },
    ],
  },
  {
    name: 'GRS',
    coinType: 17,
    passingVectors: [
      { text: 'FeBhpvNkdtxC7K3LEVT8uqskzwC4mFYrhR', hex: '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac' },
      { text: '3Ai1JZ8pdJb2ksieUV8FsxSNVJCpiWuy6m', hex: 'a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1887' },
      { text: 'grs1q9ks70lf7cz074lnn3p9ffyjfx8h0f3a8nz55sg', hex: '00142da1e7fd3ec09feafe73884a94924931eef4c7a7' },
    ],
  },
  {
    name: 'DGB',
    coinType: 20,
    passingVectors: [
      { text: 'dgb1q6fdfum8w0052aqmqjhpcpjzuyg4jlwjy9jrwz9', hex: '0014d25a9e6cee7be8ae836095c380c85c222b2fba44' },
      { text: 'DPPWe2aK4aYj3rt3yvw9zstCDXrN6frS7a', hex: '76a914c82c346ddb007e70fbb73edcbe104ecceea97bd188ac' },
      { text: 'SRFLzWuizzCPQDc5qLM2L8pZkvFws6We3j', hex: 'a9142b5feabcb3feb6c45f9b623a7f1bc16be7377db787' },
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
    name: 'XVG',
    coinType: 77,
    passingVectors: [
      { text: 'D7MKQnLxXEqn84PN42jWAVhvrXEuULLV9r', hex: '76a914183ffcc41f3095bea7ff324e52a65b46c74126e188ac' },
    ]
  },
  {
    name: 'STRAT',
    coinType: 105,
    passingVectors: [
      { text: 'SdMCMmLjD6NK8ssWt5nH2gtv6XkQXErBRs', hex: '76a914b01cb711ec63be7441c350907682a73d00bf7d2888ac' },
      { text: 'STrATiSwHPf36VbqWMUaduaN57A791YP9c', hex: '76a91447e5efb0d23a8ffa492d33df862a93e039ab622088ac' },
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
    name: 'ZEN',
    coinType: 121,
    passingVectors: [
      { text: 'znc3p7CFNTsz1s6CceskrTxKevQLPoDK4cK', hex: '20897843a3fcc6ab7d02d40946360c070b13cf7b9795' },
      { text: 'zswRHzwXtwKVmP8ffKKgWz6A7TB97Fuzx7w', hex: '2096b9d286b397a019f3a41ea6495dbce88d753f28a3' },
    ],
  },
  {
    name: 'XMR',
    coinType: 128,
    passingVectors: [
      {
        text: '41tQrTUaj2L93qVeWLaaUG3S2PP2rkaRB2woVf23r1tq3fbyCp36LmSWeMGiaLScUk6tB8f4SonDtRozPJq22i46JS1ZmLt',
        hex: '1206f6702fffbd0d301f0832b37c53890e89631be265d5060ba0a5e924d51ea60fefb70ae52bcfc5b13ac9958ea0e9ad232b090cc644efdf94548c5638b626ef9a80a25291'
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
    name: 'FIRO',
    coinType: 136,
    passingVectors: [
      { text: 'aJpBLBFFkxY1iGfBmZCTWQQABPqakQwWZ3', hex: '76a914c6870ff00109a0aaca255e609de7d40d245aa61788ac' },
      { text: 'a4roLhCKc2m3RtG7ucoxyJrCk2JqayqdSr', hex: '76a9142d743121ff929299be3c4488ce64e22634d58d5f88ac' },
      { text: 'Zzn3ivpQZ3XoTnEBUuqPuVCMJ3JBGoxmsi', hex: '76a91400ad9d984a8217ffe6548ef5c91b12e6c8d2c10788ac' },
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
    name: 'KMD',
    coinType: 141,
    passingVectors: [
      { text: 'RDNC9mLrN48pVGDQ5jSoPb2nRsUPJ5t2R7', hex: '76a9142cd2a4e3d1c2738ee4fce61e73ea822dcaacb9b488ac' },
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
    name: 'BTM',
    coinType: 153,
    passingVectors: [
      { text: 'bm1qw508d6qejxtdg4y5r3zarvary0c5xw7k23gyyf', hex: '0014751e76e8199196d454941c45d1b3a323f1433bd6' },
      { text: 'bm1qrp33g0q5c5txsp9arysrx4k6zdkfs4nce4xj0gdcccefvpysxf3qk5egtg', hex: '00201863143c14c5166804bd19203356da136c985678cd4d27a1b8c6329604903262' },
    ],
  },
  {
    name: 'BTG',
    coinType: 156,
    passingVectors: [
      { text: 'GT7Hz8QWPNmrZ9Z1mEgpYKN7Jdp97eoQjN', hex: '76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac' },
      { text : 'AQRA16uKrFpxzR17yidYtJDn2t287dc1XY', hex: 'a9145ece0cadddc415b1980f001785947120acdb36fc87' },
      { text : 'btg1zw508d6qejxtdg4y5r3zarvaryv2eet8g', hex: '5210751e76e8199196d454941c45d1b3a323' },
      {
        text : 'btg1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7kc36v4c',
        hex: '5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6'
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
    name: 'POA',
    coinType: 178,
    passingVectors: [
      { text: '0xF977814e90dA44bFA03b6295A0616a897441aceC', hex: 'f977814e90da44bfa03b6295a0616a897441acec' },
      { text: '0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8', hex: 'be0eb53f46cd790cd13851d5eff43d12404d33e8' },
    ],
  },
  {
    name: 'LCC',
    coinType: 192,
    passingVectors: [
      { text: 'CJkeBGuySxGcdY1wupo7FXT1h8bbv4zFHt', hex: '76a914191b4f0395e2e66c9c1d9ab5e77a3455acf2c67188ac' },
      { text: 'MV5hqZU1rNDZ4fubL3Jpc7GMDGHmaVtreg', hex: 'a914e8592f26abbbc754209ae58b131d54312a313b5787' },
      { text: 'lcc1q45yjegxencjtxslypllvyqfz0xk77mdklxzrcr', hex: '0014ad092ca0d99e24b343e40ffec2012279adef6db6' },
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
    name: 'BCN',
    coinType: 204,
    passingVectors: [
      {
        text: '21UQFLdH7WvPZEd8HNwXncHtDwFvv4GRqaN3R4cWyuw2TRZxRtRPb7FFTxfcwwQsqYSD2EqhgVCLsGdRdejAoHFHAHJrxxo',
        hex: '0606fd971eb1513f86da272c0e64700d64f013286f1bd024c7768bbfc24b36bd9df9f02985759782567ac26311e9637f96b452da1cb5e15c5d6f0c15cdd107bc52'
      },
      {
        text: 'bcnZ6VSM78fQNL5js7VnCybbs3ojLbdAD4DfbdJkUqghYWLqXeEgdyo9UyiAZKnB548DK1ofu8wed3jYCPT62zpf2R97SejoT7',
        hex: 'cef6222d354172048bb4e38b4b62d78aceddca4ea16a5b66133dcaec3bc71346bc5c87f5891aa07632b67a864ef9393b2b1e8620181e27b610578d4a899c2d88255f0c',
      },
    ],
  },
  {
    name: 'FIO',
    coinType: 235,
    passingVectors: [
      { text: 'FIO7tkpmicyK2YWShSKef6B9XXqBN6LpDJo69oRDfhn67CEnj3L2G', hex: '038bb1a68d19eb9139734d0f38da55cfcea955ed8f0baf42f12502e244293c08eb'},
    ],
  },
  {
    name: 'BSV',
    coinType: 236,
    passingVectors: [
      { text: '1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i', hex: '65a16059864a2fdbc7c99a4723a8395bc6f188eb' },
      { text: '1Ax4gZtb7gAit2TivwejZHYtNNLT18PUXJ', hex: '6d23156cbbdcc82a5a47eee4c2c7c583c18b6bf4' },
    ],
  },
  {
    name: 'NEO',
    coinType: 239,
    passingVectors: [{ text: 'AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF', hex: '17ad5cac596a1ef6c18ac1746dfd304f93964354b5' }],
  },
  {
    name: 'NIM',
    coinType: 242,
    passingVectors: [
      { text: 'NQ18 GAL5 Y1FC 66VV PE1X J82Q 0A2F LYPB 2EY7', hex: '82a85f85ec31bbdbb83e920580284fa7eeb13be7' },
    ],
  },
  {
    name: 'EWT',
    coinType: 246,
    passingVectors: [
      { text: '0x2ce42c2B3aCff7eddcfd32DCB0703F1870b0eBe1', hex: '2ce42c2b3acff7eddcfd32dcb0703f1870b0ebe1' },
    ],
  },
  {
    name: 'ALGO',
    coinType: 283,
    passingVectors: [
      {
        text: '7777777777777777777777777777777777777777777777777774MSJUVU',
        hex: 'ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      },
      {
        text: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAY5HFKQ',
        hex: '0000000000000000000000000000000000000000000000000000000000000000',
      },
    ],
  },
  {
    name: 'IOST',
    coinType: 291,
    passingVectors: [
      { text: 'BkHuWzs6x2wUcuDwcodwQSaWUfZHiN7SfF3vBKy1U2Qg', hex: '9fabf5897177aabbd3c3d6052b351fe6c6c36d603dba257eb5bad3a17930ca39' },
    ],
  },
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
    name: 'BTS',
    coinType: 308,
    passingVectors: [
      { text: 'BTS8QykigLRi9ZUcNy1iXGY3KjRuCiLM8Ga49LHti1F8hgawKFc3K', hex: '03d0519ddad62bd2a833bee5dc04011c08f77f66338c38d99c685dee1f454cd1b8'},
    ],
  },
  {
    name: 'CKB',
    coinType: 309,
    passingVectors: [
      { text: 'ckb1qyqt8xaupvm8837nv3gtc9x0ekkj64vud3jqfwyw5v', hex: '0100b39bbc0b3673c7d36450bc14cfcdad2d559c6c64' },
    ],
  },
  {
    name: 'LUNA',
    coinType: 330,
    passingVectors: [
      { text: 'terra1pdx498r0hrc2fj36sjhs8vuhrz9hd2cw0tmam9', hex: '0b4d529c6fb8f0a4ca3a84af03b397188b76ab0e' },
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
  { name: 'VSYS',
    coinType: 360,
    passingVectors: [
      { text: 'ARF12jvtjz9caUFmiwBeRe1SPRGQhUWKrtd', hex: '054d878288c4d4e2dd250560e303476b2152703557a0d3aa3396'},
    ],
  },
  {
    name: 'ABBC',
    coinType: 367,
    passingVectors: [
      { text: 'ABBC5i3zbGsuyexJc6NaHv81yPh2WeaqrtYMMVaEqcYLz9guAAV74A', hex: '026bff3fc4dc3cde1dcb2068bef16624a260c6f0e330addb54f894bce7fa353de6' },
      { text: 'ABBC5MTKdW6dFqEjYqQYMmLohCsALWcBAx2xRapzDTKAtz3XwKJcaf', hex: '023d3a2e33a90f8f5bcbda1ec129ba1eee5e5f2ab6a77d652cbb0517f2b49669e8' },
    ],
  },
  {
    name: 'NEAR',
    coinType: 397,
    passingVectors: [
      { text: '9902c136629fc630416e50d4f2fef6aff867ea7e.lockup.near',
        hex: '393930326331333636323966633633303431366535306434663266656636616666383637656137652e6c6f636b75702e6e656172' },
        { text: 'blah.com',
        hex: '626c61682e636f6d' },
        { text: '9685af3fe2dc231e5069ccff8ec6950eb961d42ebb9116a8ab9c0d38f9e45249',
        hex: '39363835616633666532646332333165353036396363666638656336393530656239363164343265626239313136613861623963306433386639653435323439'}
    ],
  },
  {
    name: 'ETN',
    coinType: 415,
    passingVectors: [
      {
        text: '45Jmf8PnJKziGyrLouJMeBFw2yVyX1QB52sKEQ4S1VSU2NVsaVGPNu4bWKkaHaeZ6tWCepP6iceZk8XhTLzDaEVa72QrtVh',
        hex: '6135cf83f4b3f9f6c52cb0dc0f91245945346c1ece03640b2a3c5eb9acdf650831d0b00f0a1ddfce4b9bf7df1df46dae94ac6229e492c72d03b94e3609159535',
      },
      {
        text: '46BeWrHpwXmHDpDEUmZBWZfoQpdc6HaERCNmx1pEYL2rAcuwufPN9rXHHtyUA4QVy66qeFQkn6sfK8aHYjA3jk3o1Bv16em',
        hex: '785b9309dd604860fa86133edbabfae7f89d216b1676de44025e98dc13429f398265b4c125b0c061663e76939027cd22e83520282b05ee2d4803049aefaefe01',
      },
    ],
  },
  {
    name: 'AION',
    coinType: 425,
    passingVectors: [
      {
        text: '0xa0c24fbbecf42184d1ca8e9401ddaa2a99f69f3560e3d6c673de3c8a0be2a8eb',
        hex: 'a0c24fbbecf42184d1ca8e9401ddaa2a99f69f3560e3d6c673de3c8a0be2a8eb',
      },
    ]
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
    name: 'AE',
    coinType: 457,
    passingVectors: [
      { text: 'ak_Gd6iMVsoonGuTF8LeswwDDN2NF5wYHAoTRtzwdEcfS32LWoxm', hex: '30782378f892b7cc82c2d2739e994ec9953aa36461f1eb5a4a49a5b0de17b3d23ae8' },
    ],
  },
  {
    name: 'KAVA',
    coinType: 459,
    passingVectors: [
      { text: 'kava1r4v2zdhdalfj2ydazallqvrus9fkphmglhn6u6', hex: '1d58a136edefd32511bd177ff0307c815360df68' },
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
    name: 'AR',
    coinType: 472,
    passingVectors: [
      {
        text: 'GRQ7swQO1AMyFgnuAPI7AvGQlW3lzuQuwlJbIpWV7xk',
        hex: '19143bb3040ed403321609ee00f23b02f190956de5cee42ec2525b229595ef19'
      },
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
    name: 'THETA',
    coinType: 500,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
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
    name: 'XHV',
    coinType: 535,
    passingVectors: [
      {
        text: 'hvs1VkXQ7qvBzrCuTofumZ52HNBhriXWP5kWcqZAG2VDXKuLwcCN5YaF2A4wmUXrZMGiz97eT9jXQBPp6vmRyTsk2ttY8z6YRU',
        hex: 'f4b24b708551a04541bfc33b74edddf8180bee188a01b7581c66452619634bf0b54e866dc481be8f53d1d99a470080185e01c7760aac8c4b3e2336b6b1c53da731ff047530a5df'
      },
    ],
  },
  {
    name: 'FLOW',
    coinType: 539,
    passingVectors: [{ text: '0xf233dcee88fe0abe', hex: 'f233dcee88fe0abe' }],
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
    name: 'SERO',
    coinType: 569,
    passingVectors: [
      {
        text: 'p2ya5oepEuHAdcPrn5pfNZTpLMv15ub6vmCmMyqbavPCdxpQ7BVQomCnR2Gv2YQrGUKXYEzstzyUkP7WYef2Kb6ciRcp6eazH8LhjX5cTyJc9Zs2sR7SCSNGJJuJ5K5ihUT',
        hex: '8889d697ff9f3bc140d6df1679edaf9be975bf41d655c7db7ba8d5d5f7d86b17434b9660b7ccd9f8df866c698d81cf7ae8ae10f6a4c0a17aa36db766fee3ca9ecc7af78b9506a414c2acfbba2adaf5fa811612bd8cc534ea3e083eac6464c340',
      },
      {
        text: 'SPpb3UAuzAarWVDgyU6FTtS3X5dBucTQXb89ydjqXjABiNg8x3v8jPTrGWqo974BtPvuWt9zqBKJXYyEFYjZ3CS5D2jUhncTGmYQCHFWHSAFRyM4kuBhqWcgekPm5z3Jdwj',
        hex: '49b767bca9137dbbf58eafde5936ddeb843747f450252fbe6c178094cbf76290f575a84bae4565774a0b0098df0fafae874dafc5b628c621b8ccb0ef7372562f10ed5a7343d295c1ca53235d97e7dd9c5ce957e747cbfa2d0c34af1ccacb23de',
      },
      {
        text: 'Gwdm8LqXkvmSuhS6MAP1XQEedzNJ6msxcUAFCfRi2vS8hxXGkpcxUmtBaPVS8bY6yuacyS4FD2ZfGGoP2ioYcUU4pXmxJQYa8XphWffmtsAiVbreRRWZdzFUjWsZUb8WXar',
        hex: '2e476e68ec4f9dc8b7e4d41dddd07e84ecf7a777fa9229ac7886d5c1499d4c81fe5075976c6025bbd1081caabd587543ce3ce9a2a6a11b4972c951f99f6a36a535c608d00bd7cc5f5314151b7270e820ecff823f0a55e1563a3816cd6b39ffdb',
      },
    ],
  },
  {
    name: 'BDX',
    coinType: 570,
    passingVectors: [
      {
        text: 'bxdBHRJaUhrFjfHLVESP2KQ7j56LVXhgxBCiJB2fdKvuauVSUpxAqVF3gTvEx9fcd4MditoVxumV3VYFyY35S9TK19JAmCMXz',
        hex: 'd101a272642ddf45581910432620975c8a3385df68e1bb3d3cfe4ce1c97b4c5ecab46cca3eca869e100670ba171e59a77b5b8543ecdabc9aaa9f861374856e3e10a8dd024d2d',
    }
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
    name: 'SRM',
    coinType: 573,
    passingVectors: [
      { text: '6ZRCB7AAqGre6c72PRz3MHLC73VMYvJ8bi9KHf1HFpNk', hex: '52986010573739df4b58ba50e39cf3f335b89cc7d1cb1d32b5de04efa068c939' },
    ],
  },
  {
    name: 'VLX',
    coinType: 574,
    passingVectors: [
      { text: 'VDTHiswjSTkLFbfh2S5XFsqkLzC11HoBD6', hex: '461ea68e5e13c72abf1bd2f0bcae4650521712cdb76276f0d5' },
    ]
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
    name: 'TFUEL',
    coinType: 589,
    passingVectors: [
      { text: '0x3599CF49e80A01BCb879A19599C8a6cd8C8d9aa6', hex: '3599cf49e80a01bcb879a19599c8a6cd8c8d9aa6' },
    ],
  },
  {
    name: 'GRIN',
    coinType: 592,
    passingVectors: [
      {
        text: 'grin1k6m6sjpwc047zdhsdj9r77v5nnxm33hx7wxqvw5dhd9vl0d7t4fsaqt0lg',
        hex: 'b6b7a8482ec3ebe136f06c8a3f79949ccdb8c6e6f38c063a8dbb4acfbdbe5d53'
      }
    ],
  },
  {
    name: 'OPT',
    coinType: 614,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
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
    name: 'CLO',
    coinType: 820,
    passingVectors: [
      { text: '0x5aAeb6053F3E94C9b9A09f33669435E7Ef1BeAed', hex: '5aaeb6053f3e94c9b9a09f33669435e7ef1beaed' },
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
    name: 'TOMO',
    coinType: 889,
    passingVectors: [
      { text: '0xf5C9206843DAe847DdFd551ef7b850895430EcA3', hex: 'f5c9206843dae847ddfd551ef7b850895430eca3' },
      { text: '0x15813DAE07E373DC800690031A1385eB7faDe49F', hex: '15813dae07e373dc800690031a1385eb7fade49f' },
    ],
  },
  {
    name: 'HNT',
    coinType: 904,
    passingVectors: [
      { text: '13M8dUbxymE3xtiAXszRkGMmezMhBS8Li7wEsMojLdb4Sdxc4wc', hex: '01351a71c22fefec2231936ad2826b217ece39d9f77fc6c49639926299c3869295' },
      { text: '112qB3YaH5bZkCnKA5uRH7tBtGNv2Y5B4smv1jsmvGUzgKT71QpE', hex: '00f11444921875e2ef7435513a1d1f1b0fa49e3242956a24383912ec5d4f194077' },
    ],
  },
  {
    name: 'RUNE',
    coinType: 931,
    passingVectors: [
      { text: 'thor1kljxxccrheghavaw97u78le6yy3sdj7h696nl4', hex: 'b7e4636303be517eb3ae2fb9e3ff3a212306cbd7' },
      { text: 'thor1yv0mrrygnjs03zsrwrgqz4sa36evfw2a049l5p', hex: '231fb18c889ca0f88a0370d001561d8eb2c4b95d' },
    ],
  },
  {
    name: 'BCD',
    coinType: 999,
    passingVectors: [
      { text: '1AGNa15ZQXAZUgFiqJ2i7Z2DPU2J6hW62i', hex: '76a91465a16059864a2fdbc7c99a4723a8395bc6f188eb88ac' },
      { text: '3CMNFxN1oHBc4R1EpboAL5yzHGgE611Xou', hex: 'a91474f209f6ea907e2ea48f74fae05782ae8a66525787' },
    ],
  },
  {
    name: 'TT',
    coinType: 1001,
    passingVectors: [
      { text: '0x1001EEc06f2aDff074fC2A9492e132c33d6bd54d', hex: '1001eec06f2adff074fc2a9492e132c33d6bd54d' },
    ],
  },
  {
    name: 'FTM',
    coinType: 1007,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
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
        text: 'Ae2tdPwUPEZFRbyhz3cpfC2CumGzNkFBN2L42rcUc2yjQpEkxDbkPodpMAi',
        hex: '83581cba970ad36654d8dd8f74274b733452ddeab9a62a397746be3c42ccdda000',
      },
      {
        text: 'DdzFFzCqrhsiMfvZtvTgqbR5jT4UAMEwJCT2bBvWSTiN736tSSxhnhHbmJYUhTiuZGgojfi3jizinGRVUdBF9QHgWHi11nEVpwK36gC9',
        hex: '83581c22fb739e75d1f34748c2f03365ac909aff4d5a47bad7b4231c62a949a101581e581c2374b70ae27c8cc324be7b97285bdde6eeb78354cf6d1110baa37da000',
      },
      {
        text: 'addr1qx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3n0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgse35a3x',
        hex: '019493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
      },
      {
        text: 'addr1z8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gten0d3vllmyqwsx5wktcd8cc3sq835lu7drv2xwl2wywfgs9yc0hh',
        hex: '11c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f337b62cfff6403a06a3acbc34f8c46003c69fe79a3628cefa9c47251',
      },
      {
        text: 'addr1yx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzerkr0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shs2z78ve',
        hex: '219493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8ec37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f',
      },
      {
        text: 'addr1x8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gt7r0vd4msrxnuwnccdxlhdjar77j6lg0wypcc9uar5d2shskhj42g',
        hex: '31c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542fc37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f',
      },
      {
        text: 'addr1gx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer5pnz75xxcrzqf96k',
        hex: '419493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e8198bd431b03',
      },
      {
        text: 'addr128phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtupnz75xxcrtw79hu',
        hex: '51c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f8198bd431b03',
      },
      {
        text: 'addr1vx2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzers66hrl8',
        hex: '619493315cd92eb5d8c4304e67b7e16ae36d61d34502694657811a2c8e',
      },
      {
        text: 'addr1w8phkx6acpnf78fuvxn0mkew3l0fd058hzquvz7w36x4gtcyjy7wx',
        hex: '71c37b1b5dc0669f1d3c61a6fddb2e8fde96be87b881c60bce8e8d542f',
      },
    ],
  },
  {
    name: 'SC',
    coinType: 1991,
    passingVectors: [
      {
        text: 'dfb563d6ec6ff876a059fcc96380a6d6718e1a7237e81580123070976243b77988cf8d0b7398',
        hex: 'dfb563d6ec6ff876a059fcc96380a6d6718e1a7237e81580123070976243b779',
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
    name: 'GXC',
    coinType: 2303,
    passingVectors: [
      { text: 'GXC6UKk9URcsCuGxLuRDqEuGzAqDkgKbG8AuWXFXsyzc2r9z7A1kw', hex: '02d085655f8060a79a4b12b14e442b8a554ba867bdadce3c2dc39e1a42a01827c0' },
    ]
  },
  {
    name: 'ELA',
    coinType: 2305,
    passingVectors: [
      { text: 'EQDZ4T6YyVkg9mb2cAuLEu8iBKbajQAywF', hex: '214d797cc92303dac242b17026e79bbea28eb642f29f0d3582' }
    ]
  },
  {
    name: 'NAS',
    coinType: 2718,
    passingVectors: [
      { text: 'n1FF1nz6tarkDVwWQkMnnwFPuPKUaQTdptE', hex: '195707f964ff495324635f22c7b486e05d7e67c7af5c' },
      { text: 'n1sLnoc7j57YfzAVP8tJ3yK5a2i56QrTDdK', hex: '195893f59359e3de8ddb7b4e8e9fe51afcf27c59a4c1' },
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
    name: 'IOTA',
    coinType: 4218,
    passingVectors: [
      { text: 'iota1qpw6k49dedaxrt854rau02talgfshgt0jlm5w8x9nk5ts6f5x5m759nh2ml', hex: '5dab54adcb7a61acf4a8fbc7a97dfa130ba16f97f7471cc59da8b869343537ea' },
      { text: 'iota1qrhacyfwlcnzkvzteumekfkrrwks98mpdm37cj4xx3drvmjvnep6xqgyzyx', hex: 'efdc112efe262b304bcf379b26c31bad029f616ee3ec4aa6345a366e4c9e43a3'}
    ]
  },
  {
    name: 'HNS',
    coinType: 5353,
    passingVectors: [
      { text: 'hs1qd42hrldu5yqee58se4uj6xctm7nk28r70e84vx', hex: '6d5571fdbca1019cd0f0cd792d1b0bdfa7651c7e' },
    ],
  },
  {
    name: 'STX',
    coinType: 5757,
    passingVectors: [
      { text: 'SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7', hex: 'a46ff88886c2ef9762d970b4d2c63678835bd39d71b4ba47' },
      { text: 'SM2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQVX8X0G', hex: 'a46ff88886c2ef9762d970b4d2c63678835bd39df7d47410' },
    ],
  },
  {
    name: 'GO',
    coinType: 6060,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'XCH',
    coinType: 8444,
    passingVectors: [
      { text: 'xch1f0ryxk6qn096hefcwrdwpuph2hm24w69jnzezhkfswk0z2jar7aq5zzpfj', hex: '4bc6435b409bcbabe53870dae0f03755f6aabb4594c5915ec983acf12a5d1fba'},
    ],
  },
  {
    name: 'NULS',
    coinType: 8964,
    passingVectors: [
      { text: 'NULSd6HgXY3zLvEoCRUa6yFXwpnF8gqrDeToT', hex: '0100013ba3e3c56062266262514c74fafb01852af99fec' },
      { text: 'tNULSeBaMvEtDfvZuukDf2mVyfGo3DdiN8KLRG', hex: '020001f7ec6473df12e751d64cf20a8baa7edd50810f81' },
      { text: 'AHUcC84FN4CWrhuMgvvGPy6UacBvcutgQ4rAR', hex: '79ff019fe3eff24409addcefe8f5115e17e5dfdd5f04c2' },
      { text: 'APNcCm4yik6XXquTHUNbHqfPhGrfcSoGoMudc', hex: '80ff01acfa253cc35655e300061e2563f813c5e4b9589c' },
    ],
  },
  {
    name: 'AVAX',
    coinType: 9000,
    passingVectors: [
      { text: 'avax1a5h6v9weng8guuah6aamagea0xhsd04mvs2zun', hex: 'ed2fa615d99a0e8e73b7d77bbea33d79af06bebb' },
    ],
  },
  {
    name: 'NRG',
    coinType: 9797,
    passingVectors: [
      { text: '0x7e534bc64A80e56dB3eEDBd1b54639C3A9a7CDEA', hex: '7e534bc64a80e56db3eedbd1b54639c3a9a7cdea' },
    ]
  },
  {
    name: 'ARDR',
    coinType: 16754,
    passingVectors: [
      { text: 'ARDOR-MT4P-AHG4-A4NA-CCMM2', hex: '15021913020e0f080a1313000a08021408' },
    ],
  },
  {
    name: 'ZEL',
    coinType: 19167,
    passingVectors: [
      { text: 't1XWTigDqS5Dy9McwQc752ShtZV1ffTMJB3', hex: '76a91495921ba2fc5277d8a35b0e2d339987d51681c51d88ac' },
      { text: 't3c51GjrkUg7pUiS8bzNdTnW2hD25egWUih', hex: 'a914c008da0bbc92b35ff71f613ca10ff11e2a6ae2fe87' },
    ],
  },
  {
    name: 'CELO',
    coinType: 52752,
    passingVectors: [
      { text: '0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275', hex: '67316300f17f063085ca8bca4bd3f7a5a3c66275' },
    ],
  },
  {
    name: 'WICC',
    coinType: 99999,
    passingVectors: [
      { text: 'WPCCQwJafaApw6482EkDR6V84arfa47VmT', hex: '76a91405b4701f113f51576fd7f6422dfe6ab00f41739488ac' },
      { text: 'WV116oEVxKUzrafgcRZXCNdDN7r7hjt4xV', hex: '76a91445672c77361c4f90f95b7c4c721f375a6a99766888ac' }
    ],
  },
  {
    name: 'WAN',
    coinType: 5718350,
    passingVectors: [
      { text: '0x2eF088E183231C9bEA30d8430937D3A57b7327D4', hex: '2ef088e183231c9bea30d8430937d3a57b7327d4' },
    ],
  },
  {
    name: 'WAVES',
    coinType: 5741564,
    passingVectors: [
      { text: '3PAP3wkgbGjdd1FuBLn9ajXvo6edBMCa115', hex: '01575cb3839cef68f8b5650461fe707311e2919c73b945cf1edc'},
    ],
  },
  // EVM chainIds
  {
    name: 'BSC',
    coinType: convertEVMChainIdToCoinType(56),
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'MATIC',
    coinType: convertEVMChainIdToCoinType(137),
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'ARB1',
    coinType: convertEVMChainIdToCoinType(42161),
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  }
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