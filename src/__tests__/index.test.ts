import { Buffer } from 'safe-buffer';

import { formatsByName, formatsByCoinType } from '../index';

interface TestVector {
  name: string;
  coinType: number;
  passingVectors: Array<{text: string, hex: string}>;
}

const vectors: Array<TestVector> = [
    {
      name: 'BTC',
      coinType: 0,
      passingVectors: [
        {text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', hex: '0062e907b15cbf27d5425399ebf6f0fb50ebb88f18'},
      ],
    },
    {
      name: 'LTC',
      coinType: 2,
      passingVectors: [
        {text: 'MV5rN5EcX1imDS2gEh5jPJXeiW5QN8YrK3', hex: '32e8604d28ef5d2a7caafe8741e5dd4816b7cb19ea'},
      ],
    },
    {
      name: 'MONA',
      coinType: 22,
      passingVectors: [
        {text: 'MV5rN5EcX1imDS2gEh5jPJXeiW5QN8YrK3', hex: '32e8604d28ef5d2a7caafe8741e5dd4816b7cb19ea'},
      ],
    },
    {
      name: 'ETH',
      coinType: 60,
      passingVectors: [
        {text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b'},
      ],
    },
    {
      name: 'ETC',
      coinType: 61,
      passingVectors: [
        {text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b'},
      ],
    },
    {
      name: 'RSK',
      coinType: 137,
      passingVectors: [
        {text: '0x314159265dD8dbb310642f98f50C066173C1259b', hex: '314159265dd8dbb310642f98f50c066173c1259b'},
      ],
    },
    {
      name: 'BCH',
      coinType: 145,
      passingVectors: [
        {text: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa', hex: '0062e907b15cbf27d5425399ebf6f0fb50ebb88f18'},
      ],
    },
];

for(var vector of vectors) {
  test(vector.name, () => {
    const format = formatsByName[vector.name];
    expect(formatsByCoinType[vector.coinType]).toBe(format);
    for(var example of vector.passingVectors) {
      const decoded = format.decoder(example.text);
      expect(decoded.toString('hex')).toBe(example.hex);
      const reencoded = format.encoder(decoded);
      expect(reencoded).toBe(example.text);
    }
  });
}
