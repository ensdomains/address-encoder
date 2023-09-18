import * as fs from "fs";
import * as readline from "readline";
import { evmChainIdToCoinType } from "../src/utils/evm";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const questionAsync = (question: string) =>
  new Promise<string>((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });

const coinExportTemplate = (
  coinName: string,
  capitalisedName: string,
  evmChainId?: boolean
) => `export const ${coinName} = {
  name,
  coinType,${evmChainId ? `\n  evmChainId,` : ""}
  encode: encode${capitalisedName}Address,
  decode: decode${capitalisedName}Address,
} as const satisfies Coin;`;

async function createCoin() {
  const coinName_ = await questionAsync("Coin Name: ");
  const isEvmChain = await questionAsync("Is EVM Chain? (y/n): ").then(
    (ans) => ans.toLowerCase() === "y"
  );
  const coinType = await questionAsync(
    isEvmChain ? "Chain ID: " : "Coin Type: "
  ).then((ans) => parseInt(ans));

  let coinName = coinName_.toLowerCase();
  let isLegacy = false;
  if (coinName.endsWith("legacy")) {
    isLegacy = true;
    coinName = coinName.replace("legacy", "Legacy");
  }
  const capitalisedName =
    coinName.slice(0, 1).toUpperCase() + coinName.slice(1);
  const coinTemplate = isEvmChain
    ? `import { Coin } from "../types";
import {
  createHexChecksummedDecoder,
  createHexChecksummedEncoder,
} from "../utils/hex";
  
const name = "${coinName.toUpperCase()}";
const evmChainId = ${coinType};
const coinType = ${evmChainIdToCoinType(coinType)};
  
export const encode${capitalisedName}Address = createHexChecksummedEncoder();
export const decode${capitalisedName}Address = createHexChecksummedDecoder();
  
${coinExportTemplate(coinName, capitalisedName, true)}
`
    : `import { Coin } from "../types";

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

${coinExportTemplate(coinName, capitalisedName)}
`;

  const coinFilePath = `./src/coin/${coinName}.ts`;
  const testFilePath = `./src/coin/${coinName}.test.ts`;

  await fs.promises.writeFile(coinFilePath, coinTemplate);
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

  await fs.promises.writeFile(testFilePath, testTemplate);
  console.log(`Created ${testFilePath}`);
  rl.close();
}

createCoin().catch((err) => {
  console.error(err);
});
