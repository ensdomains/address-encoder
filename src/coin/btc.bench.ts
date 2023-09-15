import { bench, group, run } from "mitata";

import { formatsByName } from "@ensdomains/address-encoder";
import { hexToBytes } from "@noble/hashes/utils";
import { decodeBtcAddress, encodeBtcAddress } from "./btc";

const btcOld = formatsByName["BTC"];

const createBenchmark = (name: string, address: string, hex: string) => {
  const bytes = hexToBytes(hex);
  const buffer = Buffer.from(bytes);

  group(`encode - ${name}`, () => {
    bench("new", () => encodeBtcAddress(bytes));
    bench("old", () => btcOld.encoder(buffer));
  });

  group(`decode - ${name}`, () => {
    bench("new", () => decodeBtcAddress(address));
    bench("old", () => btcOld.decoder(address));
  });
};

createBenchmark(
  "base58",
  "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "76a91462e907b15cbf27d5425399ebf6f0fb50ebb88f1888ac"
);

createBenchmark(
  "bech32",
  "bc1pw508d6qejxtdg4y5r3zarvary0c5xw7kw508d6qejxtdg4y5r3zarvary0c5xw7k7grplx",
  "5128751e76e8199196d454941c45d1b3a323f1433bd6751e76e8199196d454941c45d1b3a323f1433bd6"
);

await run({
  percentiles: false,
});
