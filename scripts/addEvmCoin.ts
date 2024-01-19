import * as readline from "readline";
import { coinTypeToEvmChainId } from "../src/utils/evm.js";

const SLIP44_MSB = 0x80000000;
const evmChainIdToCoinType = (chainId: number) => {
  if (chainId >= SLIP44_MSB) throw new Error("Invalid chainId");
  return (SLIP44_MSB | chainId) >>> 0;
};

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

let newCoins: [string, [string, string]][] = [];

async function addEvmCoin() {
  const coinSymbol_ = await questionAsync("Coin Symbol: ");
  const coinName_ = await questionAsync("Coin Name: ");
  const chainId = await questionAsync("Chain ID: ").then((ans) =>
    parseInt(ans)
  );

  const coinName = coinName_.trim();
  const coinSymbol = coinSymbol_.toLowerCase().trim();

  newCoins.push([`${evmChainIdToCoinType(chainId)}`, [coinSymbol, coinName]]);

  const runAgain = await questionAsync("Add another coin? (y/n): ").then(
    (ans) => ans.toLowerCase() === "y"
  );

  if (runAgain) return addEvmCoin();
}

await addEvmCoin();

console.log("Adding new coins:", newCoins.map(([, [c]]) => c).join(", "));

const { evmCoinTypeToNameMap, nonEvmCoinTypeToNameMap } = await import(
  "../src/consts/coinTypeToNameMap.js"
);

const evmCoinsWithNew = [
  ...Object.entries(evmCoinTypeToNameMap),
  ...newCoins,
].sort(([a], [b]) => parseInt(a) - parseInt(b));

const evmCoinTypeToNameMapString = `export const evmCoinTypeToNameMap = Object.freeze({
${evmCoinsWithNew
  .map(
    ([
      coinType,
      [coinSymbol, coinName],
    ]) => `  /* Chain ID: ${coinTypeToEvmChainId(parseInt(coinType))} */
  "${coinType}": ["${coinSymbol}", "${coinName}"],`
  )
  .join("\n")}
} as const);`;

const nonEvmCoinTypeToNameMapString = `export const nonEvmCoinTypeToNameMap = Object.freeze({
${Object.entries(nonEvmCoinTypeToNameMap)
  .map(
    ([coinType, [coinSymbol, coinName]]) =>
      `  "${coinType}": ["${coinSymbol}", "${coinName}"],`
  )
  .join("\n")}
} as const);`;

const coinTypeToNameMapString = `export const coinTypeToNameMap = Object.freeze({
  ...nonEvmCoinTypeToNameMap,
  ...evmCoinTypeToNameMap,
} as const);`;

const toWrite = `${evmCoinTypeToNameMapString}

${nonEvmCoinTypeToNameMapString}

${coinTypeToNameMapString}
`;

await Bun.write("./src/consts/coinTypeToNameMap.ts", toWrite);

console.log("Done!");

rl.close();
