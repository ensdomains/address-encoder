import { bench, group, run } from "mitata";

import { formatsByName } from "@ensdomains/address-encoder";
import { hexToBytes } from "@noble/hashes/utils";
import { decodeXemAddress, encodeXemAddress } from "./xem";

const xemOld = formatsByName["XEM"];

const address = "NAPRILC6USCTAY7NNXB4COVKQJL427NPCEERGKS6";
const bytes = hexToBytes("681f142c5ea4853063ed6dc3c13aaa8257cd7daf1109132a5e");
const buffer = Buffer.from(bytes);

group("encode", () => {
  bench("new", () => encodeXemAddress(bytes));
  bench("old", () => xemOld.encoder(buffer));
});

group("decode", () => {
  bench("new", () => decodeXemAddress(address));
  bench("old", () => xemOld.decoder(address));
});

await run({
  percentiles: false,
});
