import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeKsmAddress, encodeKsmAddress } from "./ksm";

describe.each([
  {
    text: "CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp",
    hex: "0aff6865635ae11013a83835c019d44ec3f865145943f487ae82a8e7bed3a66b",
  },
  {
    text: "DDioZ6gLeKMc5xUCeSXRHZ5U43MH1Tsrmh8T3Gcg9Vxr6DY",
    hex: "1c86776eda34405584e710a7363650afd1f2b38ef72836317b11ef1303a0ae72",
  },
  {
    text: "EDNfVHuNHrXsVTLMMNbp6Con5zESZJa3fkRc93AgahuMm99",
    hex: "487ee7e677203b4209af2ffaec0f5068033c870c97fee18b31b4aee524089943",
  },
])("ksm address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeKsmAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeKsmAddress(text)).toEqual(hexToBytes(hex));
  });
});
