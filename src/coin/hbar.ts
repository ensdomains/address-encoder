import type { CheckedCoin } from "../types.js";

const name = "hbar";
const coinType = 3030;

export const encodeHbarAddress = (source: Uint8Array): string => {
  if (source.length !== 20) throw new Error("Unrecognised address format");

  const view = new DataView(source.buffer, 0, 20);

  const shard = view.getUint32(0);
  const realm = view.getBigUint64(4);
  const account = view.getBigUint64(12, false);

  return [shard, realm, account].join(".");
};
export const decodeHbarAddress = (source: string): Uint8Array => {
  const view = new DataView(new ArrayBuffer(20), 0, 20);

  const components = source.split(".");
  if (components.length !== 3) throw new Error("Unrecognised address format");

  const shard = Number(components[0]);
  const realm = BigInt(components[1]);
  const account = BigInt(components[2]);

  view.setUint32(0, shard);
  view.setBigUint64(4, realm);
  view.setBigUint64(12, account);

  return new Uint8Array(view.buffer, 0, 20);
};

export const hbar = {
  name,
  coinType,
  encode: encodeHbarAddress,
  decode: decodeHbarAddress,
} as const satisfies CheckedCoin;
