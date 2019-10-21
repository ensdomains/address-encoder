import { formatsByName, formatsByCoinType } from '../index';

interface TestVector {
  name: string;
  coinType: number;
  passingVectors: Array<{ text: string; hex: string }>;
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
    name: 'RSK',
    coinType: 137,
    passingVectors: [
      { text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b' },
    ],
  },
  {
    name: 'BCH',
    coinType: 145,
    passingVectors: [
      { text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', hex: '76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac' },
    ],
  },
  {
    name: 'BNB',
    coinType: 714,
    passingVectors: [
      { text: 'bnb1grpf0955h0ykzq3ar5nmum7y6gdfl6lxfn46h2', hex: '40c2979694bbc961023d1d27be6fc4d21a9febe6' },
    ],
  },
];

vectors.forEach((vector: TestVector) => {
  test(vector.name, () => {
    const format = formatsByName[vector.name];
    expect(formatsByCoinType[vector.coinType]).toBe(format);

    for (var example of vector.passingVectors) {
      const decoded = format.decoder(example.text);
      expect(decoded.toString('hex')).toBe(example.hex);
      const reencoded = format.encoder(decoded);
      expect(reencoded).toBe(example.text);
    }

    // if(vector.failingVectors !== undefined) {
    //   for(var example of vector.failingVectors) {
    //     expect(()=>)
    //   }
    // }
  });
});
