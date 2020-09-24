import { formatsByName, formatsByCoinType } from '../index';

interface TestVector {
  name: string;
  coinType: number;
  passingVectors: Array<{ text: string; hex: string; canonical?: string }>;
  failingVectors?: Array<string>;
}

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
    name: 'DASH',
    coinType: 5,
    passingVectors: [
      { text: 'XtAG1982HcYJVibHxRZrBmdzL5YTzj4cA1', hex: '76a914bfa98bb8a919330c432e4ff16563c5ab449604ad88ac' },
      { text: '7gks9gWVmGeir7m4MhsSxMzXC2eXXAuuRD', hex: 'a9149d646d71f0815c0cfd8cd08aa9d391cd127f378687' },
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
    name: 'XEM',
    coinType: 43,
    passingVectors: [
      { text: 'NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6', hex: '681f142c5ea4853063ed6dc3c13aaa8257cd7daf1109132a5e'},
      { text: 'NAMOAVHFVPJ6FP32YP2GCM64WSRMKXA5KKYWWHPY', hex: '6818e054e5abd3e2bf7ac3f46133dcb4a2c55c1d52b16b1df8'},
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
    name: 'ATOM',
    coinType: 118,
    passingVectors: [
      { text: 'cosmos1depk54cuajgkzea6zpgkq36tnjwdzv4afc3d27', hex: '6e436a571cec916167ba105160474b9c9cd132bd' }
    ],
  },
  {
    name: 'ZIL',
    coinType: 119,
    passingVectors: [
      { text: 'zil139tkqvc8rw92e6jrs40gawwc3mmdmmauv3x3yz', hex: '89576033071b8aacea43855e8eb9d88ef6ddefbc' }
    ],
  },
  {
    name: 'ZEC',
    coinType: 133,
    passingVectors: [
      { text: 't1MgWUwDTu341f2TPmUmDrGQ6DgCtSeTMj2', hex: '1cb829c750f4e855bd1da10c277a9b4cfd02a8dd612a' },
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
      { text: 'GAI3GJ2Q3B35AOZJ36C4ANE3HSS4NK7WI6DNO4ZSHRAX6NG7BMX6VJER', hex: '11b32750d877d03b29df85c0349b3ca5c6abf64786d773323c417f34df0b2fea' },
    ],
  },
  {
    name: 'EOS',
    coinType: 194,
    passingVectors: [
      { text: 'EOS7pyZLEjxhkSBYnPJf585vcZrqdQoA4KsRHDej6i3vsnV7aseh9', hex: '03831c26f94b3af1a5f73ec3b961bc617b35bd99afe74bc1fe2c15d6d09bd4a416'},
      { text: 'EOS51imoRdUT7THtgrrVxPfYwRk3V5jVmrj18D7hbk1FQFexNmCv1', hex: '02106b727b87e01b0a298253655e7b0848ce3f4ec152ae6574643c0400ec3d1816'},
    ],
  },
  {
    name: 'TRX',
    coinType: 195,
    passingVectors: [
      { text: 'TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh', hex: '41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1'},
      { text: 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW', hex: '415a523b449890854c8fc460ab602df9f31fe4293f'},
    ],
  },
  {
    name: 'NEO',
    coinType: 239,
    passingVectors: [
      { text: 'AXaXZjZGA3qhQRTCsyG5uFKr9HeShgVhTF', hex: '17ad5cac596a1ef6c18ac1746dfd304f93964354b5' }
    ],
  },
  {
    name: 'DOT',
    coinType: 354,
    passingVectors: [
      { text: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg', hex: '0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b' },
    ],
  },
  {
    name: 'SOL',
    coinType: 501,
    passingVectors: [
      { text: 'TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh', hex: '41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1'},
      { text: 'TJCnKsPa7y5okkXvQAidZBzqx3QyQ6sxMW', hex: '415a523b449890854c8fc460ab602df9f31fe4293f'},
    ],
  },
  {
    name: 'KSM',
    coinType: 434,
    passingVectors: [
      { text: 'CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp', hex: '0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b' },
      { text: 'DDioZ6gLeKMc5xUCeSXRHZ5U43MH1Tsrmh8T3Gcg9Vxr6DY', hex: '1c86776eda34405584e710a7363650afd1f2b38ef72836317b11ef1303a0ae72' },
      { text: 'EDNfVHuNHrXsVTLMMNbp6Con5zESZJa3fkRc93AgahuMm99', hex: '487ee7e677203b4209af2ffaec0f5068033c870c97fee18b31b4aee524089943' }
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
    name: 'CELO',
    coinType: 52752,
    passingVectors: [
      { text: '0x67316300f17f063085Ca8bCa4bd3f7a5a3C66275', hex: '67316300f17f063085ca8bca4bd3f7a5a3c66275' },
    ],
  },
  {
    name: 'ADA',
    coinType: 1815,
    passingVectors: [
      { text: 'addr1gqtnpvdhqrtpd4g424fcaq7k0ufuzyadt7djygf8qdyzevuph3wczvf2dwyx5u', hex: '401730b1b700d616d51555538e83d67f13c113ad5f9b22212703482cb381bc5d81312a' }
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
    name: 'PPC',
    coinType: 6,
    passingVectors: [
      { text: 'PRL8bojUujzDGA6HRapzprXWFxMyhpS7Za', hex: '76a914b7a1c4349e794ee3484b8f433a7063eb614dfdc788ac' }
    ],
  }
];

vectors.forEach((vector: TestVector) => {
  test(vector.name, () => {
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

    // if(vector.failingVectors !== undefined) {
    //   for(var example of vector.failingVectors) {
    //     expect(()=>)
    //   }
    // }
  });
});
