import { TableEntry, tsMarkdown } from "ts-markdown";
import {
  evmCoinNameToTypeMap,
  evmCoinTypeToNameMap,
  nonEvmCoinNameToTypeMap,
  nonEvmCoinTypeToNameMap,
} from "../src/index.js";
import { coinTypeToEvmChainId } from "../src/utils/evm.js";

const supportedCryptocurrenciesMd = Bun.file(
  "./docs/supported-cryptocurrencies.md"
);
const supportedText = await supportedCryptocurrenciesMd.text();
const supLine = supportedText.split("\n");

const evmCoins = Object.entries(evmCoinTypeToNameMap);

const evmTableData: TableEntry = {
  table: {
    columns: ["Chain ID", "Name", "Full Name", "Coin Type"],
    rows: evmCoins.map(([coinType, [coinName, coinFullName]]) => {
      return [
        coinTypeToEvmChainId(parseInt(coinType)),
        coinName,
        coinFullName,
        coinType,
      ];
    }),
  },
};

const legacyCoins = Object.entries(nonEvmCoinTypeToNameMap).filter(
  ([, [coinName]]) => coinName.endsWith("Legacy")
);

const legacyTableData: TableEntry = {
  table: {
    columns: [
      "Coin Type",
      "Name",
      "Full Name",
      "Replacement Name",
      "Replacement Coin Type",
    ],
    rows: legacyCoins.map(([coinType, [coinName, coinFullName]]) => {
      const replacementName = coinName.slice(0, -6);
      const replacement =
        nonEvmCoinNameToTypeMap[replacementName] ??
        evmCoinNameToTypeMap[replacementName];
      return [
        coinType,
        coinName,
        coinFullName.replace(/^\[LEGACY\] /, ""),
        replacementName,
        replacement,
      ];
    }),
  },
};

const mainCoins = Object.entries(nonEvmCoinTypeToNameMap).filter(
  ([, [coinName]]) => !coinName.endsWith("Legacy")
);
const mainCoinsIndex = supLine.findIndex((l) => l.startsWith("### Coins"));
const mainCoinsLines = supLine.slice(mainCoinsIndex);

const mainTableData: TableEntry = {
  table: {
    columns: ["Coin Type", "Name", "Full Name", "Encoding Type"],
    rows: mainCoins.map(([coinType, [coinName, coinFullName]]) => {
      const existingLine = mainCoinsLines.find((l) =>
        l.startsWith(`| ${coinType} `)
      );
      const encodingType = existingLine
        ? existingLine.split("|")[4].trim()
        : "[UNKNOWN ENCODING TYPE, PLEASE ADD BEFORE MERGING]";
      return [coinType, coinName, coinFullName, encodingType];
    }),
  },
};

const md = tsMarkdown([
  { h2: "Supported Cryptocurrencies" },
  { h3: "EVM Chains" },
  { p: "The following EVM chains are supported:" },
  evmTableData,
  { h3: "Legacy Coins" },
  { p: "The following legacy coins are supported:" },
  legacyTableData,
  { h3: "Coins" },
  { p: "The following coins are supported:" },
  mainTableData,
]);

await Bun.write(supportedCryptocurrenciesMd, md);
