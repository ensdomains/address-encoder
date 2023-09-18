import * as fs from "fs";
import * as readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function createCoin() {
  rl.question("Coin Name: ", (coinName_) => {
    rl.question("Coin Type: ", (coinType) => {
      let coinName = coinName_.toLowerCase();
      let isLegacy = false;
      if (coinName.endsWith("legacy")) {
        isLegacy = true;
        coinName = coinName.replace("legacy", "Legacy");
      }
      const capitalisedName =
        coinName.slice(0, 1).toUpperCase() + coinName.slice(1);
      const coinTemplate = `import { Coin } from "../types";

const name = "${
        isLegacy
          ? coinName.toUpperCase().replace("LEGACY", "_LEGACY")
          : coinName.toUpperCase()
      }";
const coinType = ${coinType};

export const encode${capitalisedName}Address = (source: Uint8Array): string => {
  // TODO: Implement ${coinName} address encoding
  throw new Error('Not implemented');
};
export const decode${capitalisedName}Address = (source: string): Uint8Array => {
  // TODO: Implement ${coinName} address decoding
  throw new Error('Not implemented');
};

export const ${coinName} = {
  name,
  coinType,
  encode: encode${capitalisedName}Address,
  decode: decode${capitalisedName}Address,
} satisfies Coin;`;

      const coinFilePath = `./src/coin/${coinName}.ts`;
      const testFilePath = `./src/coin/${coinName}.test.ts`;

      fs.writeFile(coinFilePath, coinTemplate, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(`Created ${coinFilePath}`);

        const testTemplate = `import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decode${capitalisedName}Address, encode${capitalisedName}Address } from "./${coinName}";

describe.each([
  {
    text: "ADDRESS_HERE",
    hex: "HEX_HERE",
  },
])("${coinName} address", ({ text, hex }) => {
  test(\`encode: \${text}\`, () => {
    expect(encode${capitalisedName}Address(hexToBytes(hex))).toEqual(text);
  });
  test(\`decode: \${text}\`, () => {
    expect(decode${capitalisedName}Address(text)).toEqual(hexToBytes(hex));
  });
});`;

        fs.writeFile(testFilePath, testTemplate, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Created ${testFilePath}`);
          rl.close();
        });
      });
    });
  });
}

createCoin();
