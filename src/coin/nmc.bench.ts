import { bench, group, run } from "mitata";

import { formatsByName } from "@ensdomains/address-encoder";
import { hexToBytes } from "@noble/hashes/utils";
import { decodeNmcAddress, encodeNmcAddress } from "./nmc";

const nmcOld = formatsByName["NMC"];

const address = "TUrMmF9Gd4rzrXsQ34ui3Wou94E7HFuJQh";
const bytes = hexToBytes("41cf1ecacaf90a04bb0297f9991ae1262d0a3399e1");
const buffer = Buffer.from(bytes);

group("encode", () => {
  bench("new", () => encodeNmcAddress(bytes));
  bench("old", () => nmcOld.encoder(buffer));
});

group("decode", () => {
  bench("new", () => decodeNmcAddress(address));
  bench("old", () => nmcOld.decoder(address));
});

await run({
  percentiles: false,
});
