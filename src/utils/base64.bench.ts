import { bench, group, run } from "mitata";

import { base64 } from "@scure/base";
import { base64Decode, base64Encode } from "./base64.js";
import { stringToBytes } from "./bytes.js";

const data = "Hello World!";
const bytes = stringToBytes(data);
const base64Encoded = base64Encode(bytes);

group("encode", () => {
  bench("@ensdomains/address-encoder", () => base64Encode(bytes));
  bench("@scure/base", () => base64.encode(bytes));
});

group("decode", () => {
  bench("@ensdomains/address-encoder", () => base64Decode(base64Encoded));
  bench("@scure/base", () => base64.decode(base64Encoded));
});

await run({
  percentiles: false,
});
