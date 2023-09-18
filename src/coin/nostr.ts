import { Coin } from "../types";
import { createBech32Decoder, createBech32Encoder } from "../utils/bech32";

const name = "NOSTR";
const coinType = 1237;

const hrp = "npub";

export const encodeNostrAddress = createBech32Encoder(hrp);
export const decodeNostrAddress = createBech32Decoder(hrp);

export const nostr = {
  name,
  coinType,
  encode: encodeNostrAddress,
  decode: decodeNostrAddress,
} satisfies Coin;
