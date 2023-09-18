import { hexToBytes } from "@noble/hashes/utils";
import { describe, expect, test } from "bun:test";
import { decodeXmrAddress, encodeXmrAddress } from "./xmr";

describe.each([
  {
    text: "41tQrTUaj2L93qVeWLaaUG3S2PP2rkaRB2woVf23r1tq3fbyCp36LmSWeMGiaLScUk6tB8f4SonDtRozPJq22i46JS1ZmLt",
    hex: "1206f6702fffbd0d301f0832b37c53890e89631be265d5060ba0a5e924d51ea60fefb70ae52bcfc5b13ac9958ea0e9ad232b090cc644efdf94548c5638b626ef9a80a25291",
  },
  {
    text: "4495qPNxDGAT241zya1WdwG5YU6RQ6s7ZgGeQryFtooAMMxoqx2N2oNTjP5NTqDf9GMaZ52iS2Q6xhnWyW16cdi47MCsVRg",
    hex: "12426a2b555065c79b8d6293c5dd18c25a25bae1a8b8c67ceac7484133e6798579bba3444bd48d5d9fcffa64d805e3977b07e2d420a2212df3d612a5dbcc67653844ded707",
  },
  {
    text: "47Mov77LGqgRoRh6K6XVheSagWVRS7jkQLCR9jPQxTa8g2SrnwbWuMzKWRLyyBFsxn7gHJv15987MDMkYXCXGGvhKA7Qsx4",
    hex: "12975e989ae39b7b9445ac7384edb7a598efe3fbfab6c0bd72c5372fadd86071e95096d3b5eedd396ea5c521456640fb27ebb5a222269eac49e1ddac7134735ea0efb2b899",
  },
  {
    text: "48fj5P3zky9FETVG144GWh2oxnEdBc45VFHLKgKQfZ7UdyJ5M7mDFxuEA12eBuD55RAwgX2jzFYfwjhukHavcLHW9vKn1VG",
    hex: "12b9e8cd1f42a48c55166f75ead8293e0ad1c420f566b9c85562572936207557dd08613f96d197024ea651e8f226feb03b71aa82f487cb6eff518a30a3b6a2514f0eb176af",
  },
  {
    text: "48vTj54ZtU7e6sqwcJY9uq2LApd3Zi6H23vmYFc3wMteS2QzJwi2Z1xCLVwMac55h2HnQAiYwZTceJbwMZJRrm3uNh76Hci",
    hex: "12c09d10f3c5f580ddd0765063d9246007f45ef025a76c7d117fe4e811fa78f3959c66f7487c1bef43c64ee0ace763116456666a389eea3b693cd7670c3515a0c043794fbf",
  },
  {
    text: "48oYzqzeGqY3Nfg6LG8HwS3uF1Y3vV2gfRH6ZMcnhhEmUgkL2mPSjtuSekenrYGkbp8RNvAvrtq3r7Ze4iPoBH3kFK9vbgP",
    hex: "12bd785822c5e8330e30cc7e6e7abd3d11579da04e4131d091255172583059aea58501a7d7657332995b54357cc02c972c5cf5b2d1804d4d273c6f214854c9cf7edd34d73c",
  },
])("xmr address", ({ text, hex }) => {
  test(`encode: ${text}`, () => {
    expect(encodeXmrAddress(hexToBytes(hex))).toEqual(text);
  });
  test(`decode: ${text}`, () => {
    expect(decodeXmrAddress(text)).toEqual(hexToBytes(hex));
  });
});
