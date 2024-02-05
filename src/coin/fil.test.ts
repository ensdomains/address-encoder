import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeFilAddress, encodeFilAddress } from "./fil.js";

describe.each([
  {
    // Protocol 0: ID
    // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L15
    text: "f0150",
    // Buffer.from(Uint8Array.of(0, 150, 1)).toString('hex')
    hex: "009601",
  },
  {
    // Protocol 1: Secp256k1 Addresses
    // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L50
    text: "f15ihq5ibzwki2b4ep2f46avlkrqzhpqgtga7pdrq",
    // Buffer.from(Uint8Array.of(1,234,15,14,160,57,178,145,160,240,143,209,121,224,85,106,140,50,119,192,211)).toString('hex')
    hex: "01ea0f0ea039b291a0f08fd179e0556a8c3277c0d3",
  },
  {
    // Protocol 2: Actor address
    // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L183
    text: "f24vg6ut43yw2h2jqydgbg2xq7x6f4kub3bg6as6i",
    // Buffer.from(Uint8Array.of(2,229,77,234,79,155,197,180,125,38,24,25,130,109,94,31,191,139,197,80,59)).toString('hex')
    hex: "02e54dea4f9bc5b47d261819826d5e1fbf8bc5503b",
  },
  {
    // Protocol 3: BLSAddresses
    // https://github.com/glifio/modules/blob/primary/packages/filecoin-address/test/constants.js#L183
    text: "f3vvmn62lofvhjd2ugzca6sof2j2ubwok6cj4xxbfzz4yuxfkgobpihhd2thlanmsh3w2ptld2gqkn2jvlss4a",
    // Buffer.from(Uint8Array.of(3,173,88,223,105,110,45,78,145,234,134,200,129,233,56,186,78,168,27,57,94,18,121,123,132,185,207,49,75,149,70,112,94,131,156,122,153,214,6,178,71,221,180,249,172,122,52,20,221)).toString('hex')
    hex: "03ad58df696e2d4e91ea86c881e938ba4ea81b395e12797b84b9cf314b9546705e839c7a99d606b247ddb4f9ac7a3414dd",
  },
])("fil address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeFilAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeFilAddress(text)).toEqual(hexToBytes(hex));
  });
});
